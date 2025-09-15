const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        birthday: {
            type: Date,
        },
        first: {
            type: String,
            required: true,
        },
        last: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
