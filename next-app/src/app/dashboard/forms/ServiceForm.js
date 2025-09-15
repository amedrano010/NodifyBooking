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
        label: "Service Name",
        type: "text",
        placeholder: "Enter service name",
        required: true,
    },
    {
        name: "description",
        label: "Description",
        type: "text",
        placeholder: "Enter service description",
    },
    {
        name: "prefix",
        label: "Price Prefix",
        type: "select",
        placeholder: "Select prefix",
    },
    {
        name: "price",
        label: "Price ($USD)",
        type: "number",
        placeholder: "Enter service price",
        required: true,
    },

    {
        name: "duration",
        label: "Estimated duration in (minutes)",
        type: "number",
        placeholder: "Enter duration",
        required: true,
    },
    {
        name: "category",
        label: "Category",
        type: "text",
        placeholder: "Enter category",
    },
    {
        name: "staff",
        label: "Assigned staff",
        type: "text",
        placeholder: "Enter staff",
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
        placeholder: "Enter image",
    },
];

const initialValues = {
    name: "",
    description: "",
    prefix: "",
    price: "",
    files: [],
    duration: "",
    category: "",
    staff: "",
    tags: [],
};

const validationSchema = Yup.object({
    name: Yup.string().required("Title is required"),
    description: Yup.string(),
    prefix: Yup.string(),
    price: Yup.number().required("Price is required"),
    duration: Yup.number().required("Duration is required"),
    category: Yup.string(),
    staff: Yup.array().of(Yup.string()),
    tags: Yup.array().of(Yup.string()),
});

const ServiceForm = ({ open, setOpen }) => {
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
            formData.append("duration", values.duration);
            formData.append("category", values.category);
            formData.append("staff", values.staff);
            formData.append("tags", values.tags);
            formData.append("company", company);
            formData.append("store", user.selectedStore._id);

            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
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
            toast.success("service created!");
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
                title={`New Service`}
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

export default ServiceForm;
