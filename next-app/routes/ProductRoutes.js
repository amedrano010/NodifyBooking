const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Product = require("../models/ProductModel");
const CompanyProduct = require("../models/CompanyProduct");

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

// Route to create a new Product
router.post("/", upload.array("files", 10), async (req, res) => {
    try {
        const filePaths = req.files?.map(
            (file) =>
                `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${file.filename}`
        );

        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            quantity: req.body.quantity,
            images: filePaths,
        });

        await newProduct.save();

        if (newProduct) {
            const newCompanyProduct = new CompanyProduct({
                product: newProduct._id,
                company: req.body.company,
                store: req.body.store,
            });

            await newCompanyProduct.save();
        }

        res.status(201).send("Product created successfully");
    } catch (error) {
        res.status(500).send("Error creating product: " + error.message);
    }
});

// Route to get all Products
router.get("/", async (req, res) => {
    const { company } = req.query;

    try {
        if (!company) {
            res.status(500).send("Must provide company to fetch products");
        } else {
            const products = await CompanyProduct.find({
                company: company,
            }).populate("product");

            res.status(200).json(
                products.filter((item) => item.product != null)
            );
        }
    } catch (error) {
        res.status(500).send("Error fetching products: " + error.message);
    }
});

// Route to update a product
router.put("/:id", upload.array("files", 10), async (req, res) => {
    try {
        let filePaths = req.files?.map(
            (file) => `/public/images/${file.filename}`
        );

        let updatedImages = [...filePaths];

        if (typeof req.body.existingFiles === "string") {
            updatedImages.push(req.body.existingFiles);
        } else if (Array.isArray(req.body.existingFiles)) {
            updatedImages = [...req.body.existingFiles, ...updatedImages];
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                inventory: req.body.inventory,
                images: updatedImages,
                favoriteImage: req.body.favoriteImage,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }

        res.status(200).send("Product updated successfully");
    } catch (error) {
        res.status(500).send("Error updating product: " + error.message);
    }
});

// Route to delete a product
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        // Remove associated files from the images directory
        product.images.forEach((filePath) => {
            const fullPath = path.join(__dirname, "..", filePath);
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${fullPath}`, err);
                }
            });
        });

        res.status(200).send("Product deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting product: " + error.message);
    }
});

module.exports = router;
