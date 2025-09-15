const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const User = require("../models/UserModel");

dotenv.config();

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

//Get users assigned to a store

//update user
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { _id, stripeId, services } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "User  not found" });
        }

        let updatedUser;
        if (stripeId) {
            updatedUser = await User.findOneAndUpdate(
                { _id: _id },
                { $set: { stripeId: stripeId } },
                { new: true } // Return the updated document
            );
        }

        res.json(updatedUser);
    })
);

router.patch(
    "/",
    asyncHandler(async () => {})
);

router.delete(
    "/",
    asyncHandler(async () => {})
);

module.exports = router;
