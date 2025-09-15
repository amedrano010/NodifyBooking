const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Service = require("../models/ServiceModel");
const User = require("../models/UserModel");
const CompanyService = require("../models/CompanyService");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.use((req, res, next) => {
    // .. some logic here .. like any other middleware
    next();
});

// Route to create a new Service
router.post("/", upload.array("files", 10), async (req, res) => {
    try {
        const filePaths = req.files?.map(
            (file) =>
                `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${file.filename}`
        );

        const newService = new Service({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            duration: req.body.duration,
            images: filePaths,
        });

        await newService.save();

        const newCompanyService = new CompanyService({
            service: newService._id,
            company: req.body.company,
            store: req.body.store,
        });

        await newCompanyService.save();
        res.status(201).send("Service created successfully");
    } catch (error) {
        res.status(500).send("Error creating service: " + error.message);
    }
});

//Route to get all services
router.get("/", async (req, res) => {
    try {
        const { company, provider } = req.query;
        let services = [];

        if (provider) {
            const user = await User.findById(provider).exec();
            services = user.services;
        } else {
            services = await CompanyService.find({ company: company }).populate(
                "service"
            );
        }

        res.status(201).json(services.filter((item) => item.service != null));
    } catch (err) {
        res.status(500).send("Error getting services " + err.message);
    }
});

// Route to update a Service
router.put("/:id", upload.array("files", 10), async (req, res) => {
    try {
        let filePaths = req.files?.map(
            (file) => `/public/images/${file.filename}`
        );

        let updatedImages = [...filePaths];

        if (typeof req.body.existingFiles === "string") {
            updatedImages.unshift(req.body.existingFiles);
        } else if (Array.isArray(req.body.existingFiles)) {
            updatedImages = [...req.body.existingFiles, ...updatedImages];
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                duration: req.body.duration,
                images: updatedImages,
                favoriteImage: req.body.favoriteImage,
            },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).send("Service not found");
        }

        res.status(200).send("Service updated successfully");
    } catch (error) {
        res.status(500).send("Error updating service: " + error.message);
    }
});

// Route to delete a service
router.delete("/:id", async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).send("Product not found");
        }

        // Remove associated files from the images directory
        service.images.forEach((filePath) => {
            const fullPath = path.join(__dirname, "..", filePath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${fullPath}`, err);
                }
            });
        });

        res.status(200).send("service deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting service: " + error.message);
    }
});

module.exports = router;
