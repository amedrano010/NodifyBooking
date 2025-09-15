const mongoose = require("mongoose");

const storeEmployeeSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    role: {
        type: String,
        enum: ["Owner", "Manager", "Staff"],
        default: "Owner",
    },
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },
    ],
});

const StoreEmployee = mongoose.model("StoreEmployee", storeEmployeeSchema);

module.exports = StoreEmployee;
