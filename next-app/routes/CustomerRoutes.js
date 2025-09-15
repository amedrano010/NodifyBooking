const express = require("express");
const router = express.Router();
const Customer = require("../models/CustomerModel");
const CompanyClient = require("../models/CompanyCustomerModel");

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

// Route to create a new Customer
router.post("/", async (req, res) => {
    try {
        let { company } = req.body;

        //Create new customer
        const newClient = new Customer({
            first: req.body.first,
            last: req.body.last,
            email: req.body.email,
            phone: req.body.phone,
            notes: req.body.notes,
        });

        //Associate client to company
        const newCompanyClient = new CompanyClient({
            company: company,
            client: newClient._id,
        });

        //Save data
        await newClient.save();
        await newCompanyClient.save();

        res.status(201).json(newClient);
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error for email
            res.status(400).json({ message: "Email already exists" });
        } else {
            res.status(500).send("Error creating customer: " + error.message);
        }
    }
});

// Route to get all customers
router.get("/", async (req, res) => {
    try {
        let clients;
        let { search, company } = req.query;

        const query = {};

        const limit = search == "" ? 10 : undefined;

        if (search?.trim()) {
            query.$or = [
                { first: { $regex: search, $options: "i" } },
                { last: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        const oCompany = await CompanyClient.find({ company })
            .populate({
                path: "client",
                match: query,
            })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();

        //Remove null values first then send data to client
        clients = oCompany
            .filter((item) => item.client != null)
            .map((item) => item.client);
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).send("Error fetching customers: " + error.message);
    }
});

// Route to update a customer
router.get("/:id", async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).send("Error fetching customer : " + error.message);
    }
});

//NEED TO UPDATE, CANT HAVE SAME ROUTE
router.get("/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const oCustomer = await Customer.findOne({ email: email });

        res.json(oCustomer);
    } catch (e) {
        res.json(e);
    }
});

// Route to update a customer
router.put("/:id", async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                phone: req.body.phone,
                notes: req.body.notes,
            },
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).send("Customer not found");
        }

        res.status(200).send("Customer updated successfully");
    } catch (error) {
        res.status(500).send("Error updating customer: " + error.message);
    }
});

// Route to delete a customer
router.delete("/:id", async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

        if (!deletedCustomer) {
            return res.status(404).send("Customer not found");
        }

        res.status(200).send("Customer deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting customer: " + error.message);
    }
});

module.exports = router;
