const express = require("express");
const router = express.Router();

const Store = require("../models/StoreModel");

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

router.get("/", async (req, res) => {
    const { store, company } = req.query;

    try {
        const oQuery = {
            ...(store && { _id: store }),
            ...(company && { company }),
        };

        const arrStores = await Store.find(oQuery).populate("company").exec();

        if (arrStores && arrStores.length > 0) {
            res.json(arrStores);
        } else {
            res.status(404).json({ message: "Could not find stores" });
        }
    } catch (e) {
        res.json(e);
    }
});

module.exports = router;
