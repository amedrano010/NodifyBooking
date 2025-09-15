const mongoose = require("mongoose");

const companyServiceSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },
});

const CompanyService = mongoose.model("CompanyService", companyServiceSchema);

module.exports = CompanyService;
