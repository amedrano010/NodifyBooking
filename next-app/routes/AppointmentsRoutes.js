const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const cron = require("node-cron");
const moment = require("moment");

const Appointment = require("../models/AppointmentModel");
const Customer = require("../models/CustomerModel");
const Store = require("../models/StoreModel");
const Services = require("../models/ServiceModel");

dotenv.config();

const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const client = new twilio(accountSid, authToken);

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

// Route to get all appointments
router.get("/", async (req, res) => {
    try {
        if (!req.query.store) {
            res.json({ message: "Must provide a store id" });
            return;
        }

        let appointments;
        const oQuery = {
            store: req.query.store,
        };
        if (req.query.start) {
            if (!oQuery.startDate) {
                oQuery.startDate = {};
            }

            oQuery.startDate.$gte = req.query.start;
        }
        if (req.query.end) {
            if (!oQuery.startDate) {
                oQuery.startDate = {};
            }
            oQuery.startDate.$lte = req.query.end;
        }

        if (req.query.type) {
            oQuery.type = req.query.type;
        }

        appointments = await Appointment.find(oQuery)
            .sort({ startDate: "asc" })
            .populate("client")
            .populate("services")
            .populate("provider")
            .exec();

        res.json(appointments);
    } catch (error) {
        res.status(500).send("Error fetching appointments: " + error.message);
    }
});

// Route to create a new appointment
router.post("/", async (req, res) => {
    try {
        const newBooking = new Appointment({
            provider: req.body.provider,
            store: req.body.store,
            client: req.body.client,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            services: req.body.services,
            createdBy: req.body.createdBy,
        });

        await newBooking.save();

        // Fetch customer details to get the phone number
        const customer = await Customer.findById(req.body.client);

        // Send SMS confirmation
        client.messages
            .create({
                body: `Your appointment is confirmed for ${newBooking.startDate}.`,
                to: `18777804236`, // customer.phone
                from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
            })
            .then((message) => console.log(message.sid))
            .catch((error) => console.error("Error sending SMS:", error));

        res.status(201).send("Appointment created successfully");
    } catch (error) {
        res.status(500).send("Error creating appointment: " + error.message);
    }
});

// Route to create a new appointment
router.post("/new", async (req, res) => {
    //console.log(req.body);
    //update to calculate slot duration on the server side
    const { slot, services } = req.body;

    const arrPromises = services.map(
        async (serv) => await Services.findById(serv)
    );

    const oServices = await Promise.all(arrPromises);
    const durationMin = oServices.reduce((acc, curr) => acc + curr.duration, 0);
    const startDate = moment(slot.utc);
    const endDate = moment(slot.utc).add(durationMin, "minutes");

    const oAppointment = {
        provider: req.body.provider,
        store: req.body.store,
        customer: req.body.customer,
        startDate: startDate,
        endDate: endDate.utc(),
        services: services,
    };

    try {
        const newBooking = new Appointment(oAppointment);

        await newBooking.save();

        // Fetch customer details to get the phone number
        const customer = await Customer.findById(req.body.customer);

        // Send SMS confirmation
        client.messages
            .create({
                body: `Your appointment is confirmed for ${newBooking.startDate}.`,
                to: `18777804236`, // customer.phone
                from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
            })
            .then((message) => console.log(message.sid))
            .catch((error) => console.error("Error sending SMS:", error));

        res.status(201).json({ appointment: newBooking._id });
    } catch (error) {
        res.status(500).send("Error creating appointment: " + error.message);
    }
});

//Route to get all appointments for a customer
router.get("/customer", async (req, res) => {
    const { customer: customerId } = req.query;

    try {
        const customer = await Customer.findById(customerId);

        if (!customer) {
            res.json({ message: "customer not found" });
            return;
        }

        const oQuery = {
            customer: customer._id,
            status: {
                $in: ["Scheduled", "Confirmed"],
            },
        };

        appointments = await Appointment.find(oQuery)
            .sort({ startDate: "asc" })
            .populate("services")
            .populate("provider")
            .populate("store")
            .exec();

        res.json(appointments);
    } catch (error) {
        res.status(500).send("Error fetching appointments: " + error.message);
    }
});

// Route to handle incoming SMS replies
router.post("/sms-reply", async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const incomingMessage = req.body.Body.trim().toLowerCase();
    const fromNumber = req.body.From;

    try {
        // Find the appointment based on the phone number
        const customer = await Customer.findOne({ phone: fromNumber });
        if (!customer) {
            twiml.message("No appointment found for this number.");
            res.writeHead(200, { "Content-Type": "text/xml" });
            res.end(twiml.toString());
            return;
        }

        const appointment = await Appointment.findOne({
            customer: customer._id,
        }).sort({ startDate: -1 });
        if (!appointment) {
            twiml.message("No appointment found for this number.");
            res.writeHead(200, { "Content-Type": "text/xml" });
            res.end(twiml.toString());
            return;
        }

        if (incomingMessage === "yes") {
            appointment.status = "Confirmed";
            await appointment.save();
            twiml.message("Your appointment has been confirmed.");
        } else if (incomingMessage === "no") {
            appointment.status = "Cancelled";
            await appointment.save();
            twiml.message("Your appointment has been cancelled.");
        } else {
            twiml.message(
                "Please reply with YES to confirm or NO to cancel your appointment."
            );
        }

        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
    } catch (error) {
        console.error("Error handling SMS reply:", error);
        res.status(500).send("Error handling SMS reply: " + error.message);
    }
});

//Route to update appointment
router.put("/:id", async (req, res) => {
    console.log(req.body);

    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body
        );

        res.send(appointment);
    } catch (err) {
        res.status(500).send("Error updating appointments: " + error.message);
    }
});

// Route to delete a customer
router.delete("/:id", async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(
            req.params.id
        );

        if (!deletedAppointment) {
            return res.status(404).send("Appointment not found");
        }

        res.status(200).send("Appointment deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting appointment: " + error.message);
    }
});

// Every 30 minutes check of appointments were missed
cron.schedule("1,15,30,45 * * * *", async () => {
    try {
        const thirtyAgo = new Date();
        thirtyAgo.setMinutes(thirtyAgo.getMinutes() - 30);

        const yestAppointments = await Appointment.find({
            startDate: {
                $lt: thirtyAgo,
            },
            status: "Scheduled",
        }).exec();

        yestAppointments.forEach(async (appointment) => {
            appointment.status = "Missed";
            await appointment.save();
        });

        console.log("Updated missed appointments");
    } catch (error) {
        console.error("Error updating missed appointments:", error);
    }
});

// Schedule a cron job to run every minute
cron.schedule("* * * * *", async () => {
    return;
    try {
        const now = new Date();
        const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

        const appointments = await Appointment.find({
            startDate: {
                $gte: now,
                $lt: threeHoursLater,
            },
            status: "Scheduled", // Only send reminders for scheduled appointments
            reminderSent: false, // Only send reminders if they haven't been sent yet
        }).populate("client");

        appointments.forEach((appointment) => {
            const customer = appointment.client;
            client.message
                .create({
                    body: `Reminder: Your appointment is scheduled for ${appointment.startDate}. Reply YES to confirm or NO to cancel.`,
                    to: customer.phone, // Text this number
                    from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                })
                .then(async (message) => {
                    console.log(`Reminder sent: ${message.sid}`);
                    // Update the reminderSent flag
                    appointment.reminderSent = true;
                    await appointment.save();
                })
                .catch((error) =>
                    console.error("Error sending reminder SMS:", error)
                );
        });
    } catch (error) {
        console.error("Error scheduling reminders:", error);
    }
});

module.exports = router;
