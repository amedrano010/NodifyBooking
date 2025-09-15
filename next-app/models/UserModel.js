const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first: {
        type: String,
        required: true,
    },
    last: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    stripeId: {
        type: String,
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
