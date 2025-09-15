const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Stripe = require("stripe");

const User = require("../models/UserModel");
const Company = require("../models/CompanyModel");
const Store = require("../models/StoreModel");
const StoreEmployee = require("../models/StoreEmployeeModel");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

//create user
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { company, first, last, email, password, accountType } = req.body;

        if (
            !company ||
            !email ||
            !password ||
            !first ||
            !last ||
            !accountType
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //Check for duplicates
        const duplicate = await User.findOne({ email }).lean().exec();

        if (duplicate) {
            return res.status(409).json({ message: "User already exist" });
        }

        // Create Stripe account
        const stripeAccount = await stripe.accounts.create({
            type: "express",
            email,
            business_type: "individual",
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        //hash password
        const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
        const userObject = {
            first,
            last,
            email,
            password: hashedPwd,
        };

        //Create and store new user
        const user = await User.create(userObject);

        await user.save();

        //Create company
        const newCompany = await Company.create({
            name: company,
            accountType: accountType, // individual, team, enterprise
            stripeAccountId: stripeAccount.id,
        });

        //Create first store
        const store = await Store.create({
            company: newCompany._id,
            name: "Store 1",
        });

        await StoreEmployee.create({
            store: store._id,
            employee: user._id,
            role: "Owner",
        });

        //CREATE A STORE AND COMPANY RELATIONSHIP

        // Generate onboarding link
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccount.id,
            refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
            type: "account_onboarding",
        });

        if (user) {
            res.status(201).json({ user, onboardingUrl: accountLink.url });
        } else {
            res.status(400).json({ message: "Invalid User data " });
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

module.exports = router;
