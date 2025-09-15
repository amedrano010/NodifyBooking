const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

const User = require("../models/UserModel");
const Company = require("../models/CompanyModel");
const Store = require("../models/StoreModel");
const StoreEmployee = require("../models/StoreEmployeeModel");

dotenv.config();

const secret = process.env.JWT_SECRET;

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

//create user
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const oUser = await User.findOne({ email }).lean().exec();

        if (oUser) {
            //Check password
            isPassword = await bcrypt.compare(password, oUser.password);

            if (isPassword) {
                //create token and send

                const token = await jwt.sign(
                    {
                        data: oUser._id,
                    },
                    secret,
                    { expiresIn: rememberMe == "on" ? "30d" : "30d" }
                );

                const cookieOptions = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", // Set to true in production
                    sameSite: "Strict",
                };

                if (rememberMe === "on") {
                    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
                }

                delete oUser.password; // return user info without password

                return res.cookie("token", token, cookieOptions).json(oUser);
            }
        } else {
            return res
                .status(409)
                .json({ message: "username or password incorrect" });
        }
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

router.get("/profile", async (req, res) => {
    const { token } = req.cookies;

    if (token) {
        const oToken = jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                res.json({ _id: undefined });
            } else {
                const oUser = await User.findById(decoded.data)

                    .select("-password")
                    .lean()
                    .exec();

                if (oUser) {
                    const userStores = await StoreEmployee.find({
                        employee: oUser._id,
                    })
                        .populate("store")
                        .select("-employee");

                    if (userStores.length > 0) {
                        oUser.stores = userStores;
                        oUser.selectedStore = userStores[0].store._id;
                    }

                    res.status(200).json(oUser);
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            }
        });
    } else {
        res.json({ _id: undefined });
    }
});

router.post("/signout", async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        sameSite: "Strict",
    });
    res.status(200).json({ message: "Signout successful" });
});

module.exports = router;
