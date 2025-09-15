const express = require("express");
const router = express.Router();
const Company = require("../models/CompanyModel");

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

// Route to get company
router.get("/:store", async (req, res) => {
    const store = req.params.store;

    try {
        const company = await Company.findOne({ store: store });

        res.status(200).json(company);
    } catch (error) {
        res.status(500).send("Error fetching company: " + error.message);
    }
});

module.exports = router;
