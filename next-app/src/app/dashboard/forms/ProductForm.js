"use client";

import React, { useState } from "react";
import Modal from "/components/Modal";
import * as Yup from "yup";
import ReusableForm from "/components/Form";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../context/userContext";

const fields = [
    {
        name: "name",
        label: "Product Name",
        type: "text",
        placeholder: "Enter product name",
        required: true,
    },
    {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Enter product description",
    },

    {
        name: "prefix",
        label: "Price Prefix",
        type: "select",
        placeholder: "Select prefix",
    },
    {
        name: "price",
        label: "Price (ex: '19.99')",
        type: "number",
        step: "0.01",
        placeholder: "$USD",
        required: true,
    },
    {
        name: "category",
        label: "Category",
        type: "text",
        placeholder: "Enter product category",
    },

    {
        name: "sku",
        label: "SKU",
        type: "text",
        placeholder: "Enter SKU",
    },
    {
        name: "barcode",
        label: "Barcode",
        type: "text",
        placeholder: "Enter barcode",
    },
    {
        name: "brand",
        label: "Brand",
        type: "text",
        placeholder: "Enter Brand",
    },
    {
        name: "stock",
        label: "Inventory qty",
        type: "number",
        placeholder: "Enter qty",
    },
    {
        name: "tags",
        label: "Tags",
        type: "text",
        placeholder: "Enter tags",
    },
    {
        name: "files",
        label: "Photos",
        type: "files",
    },
];

const initialValues = {
    name: "",
    description: "",
    category: "",
    prefix: "",
    price: 0,
    files: [],
    sku: "",
    barcode: "",
    brand: "",
    stock: "",
    tags: "",
};

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    category: Yup.string(),
    prefix: Yup.string(),
    price: Yup.number().required("Price is required"),
    sku: Yup.string(),
    barcode: Yup.string(),
    brand: Yup.string(),
    stock: Yup.number(),
    tags: Yup.array().of(Yup.string()),
});

const ProductForm = ({ open, setOpen }) => {
    const { user, setUser } = useUser();
    const company = user.selectedStore.companyId;

    //Create new client
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        // Replace with your API call or logic
        try {
            const formData = new FormData(); //required in order to send files to server
            // append files
            values.files.forEach((file) => formData.append("files", file));

            formData.append("name", values.name);
            formData.append("desription", values.description);
            formData.append("prefix", values.prefix);
            formData.append("price", values.price);
            formData.append("category", values.category);
            formData.append("sku", values.sku);
            formData.append("barcode", values.barcode);
            formData.append("brand", values.brand);
            formData.append("qty", values.qty);
            formData.append("tags", values.tags);
            formData.append("company", company);
            formData.append("store", user.selectedStore._id);

            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            resetForm();
            setOpen(false);
            // Optionally show a success message here
            toast.success("Product created!");
        } catch (error) {
            // Optionally show an error message here

            const message =
                error.response?.data?.message ||
                error.message ||
                "An error occurred";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Modal
                title={`New Product`}
                open={open}
                setOpen={() => setOpen(false)}
            >
                <ReusableForm
                    fields={fields}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </>
    );
};

export default ProductForm;
