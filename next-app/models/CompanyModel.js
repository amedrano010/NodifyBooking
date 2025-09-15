const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    accountType: {
        type: "String",
        required: true,
    },
    paymentPerMonth: {
        type: Number, //in cents
    },
    paymentPerUser: {
        type: Number, // in cents
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
