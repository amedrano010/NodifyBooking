const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    name: {
        type: String,
        required: true,
    },

    terminals: {
        type: [String],
    },
    address: {
        type: String,
    },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
