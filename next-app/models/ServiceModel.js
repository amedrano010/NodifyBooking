const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
    },
    images: {
        type: [String],
    },
    favoriteImage: {
        type: String,
    },
    //Removed provders property to StoreEmployeeModel
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
