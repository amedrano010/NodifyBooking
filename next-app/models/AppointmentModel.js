const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Appointment", "Event", "Blackout"],
            default: "Appointment",
        },
        title: {
            type: String,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: [
                "Scheduled",
                "Confirmed",
                "Completed",
                "Cancelled",
                "Missed",
            ],
            default: "Scheduled",
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "deposit", "paid", "refunded"],
            default: "unpaid",
        },
        notes: {
            type: String,
        },
        blackoutReason: {
            type: String,
            enum: ["holiday", "vacation", "maintenance"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
