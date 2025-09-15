const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const StoreEmployee = require("../models/StoreEmployeeModel");
dotenv.config();

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const { store } = req.query;

        const employees = await StoreEmployee.find({
            store,
        })

            .populate({
                path: "employee",
                select: "_id first last email profile_pic",
            })
            .populate("services")
            .select("-password")
            .exec();

        console.log(employees);

        res.json(employees);
    })
);

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { user, store, services } = req.body;

        if (user && store && services) {
            const updatedUser = await StoreEmployee.findOneAndUpdate(
                { employee: user, store: store },
                { $set: { services: services } },
                { new: true } // Return the updated document
            );

            res.json(updatedUser);
        } else {
            res.json({
                message: "must provide a user, store, and services array",
            });
        }
    })
);

router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const { store, employee } = req.query;

        if (store) {
            const employees = await StoreEmployee.find({
                store: store,
                employee: employee,
            })

                .populate({
                    path: "employee",
                    select: "_id first last email profile_pic",
                })
                .populate("services")
                .select("-password")
                .exec();

            if (employees && employees.length > 0) {
                res.json(employees);
            } else {
                res.json({ message: "Users not found" });
            }
        } else {
            res.json({ message: "Store not found" });
        }
    })
);

module.exports = router;
