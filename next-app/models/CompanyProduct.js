const mongoose = require("mongoose");

const companyProductSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
});

const CompanyProduct = mongoose.model("CompanyProduct", companyProductSchema);

module.exports = CompanyProduct;
