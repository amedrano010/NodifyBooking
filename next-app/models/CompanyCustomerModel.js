const mongoose = require("mongoose");

const CompanyClientSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
        },
    },
    { timestamps: true }
);

const CompanyClient = mongoose.model("CompanyClient", CompanyClientSchema);

module.exports = CompanyClient;
