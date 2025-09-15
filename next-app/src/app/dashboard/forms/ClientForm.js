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
        name: "first",
        label: "First Name",
        type: "text",
        placeholder: "Enter first name",
        required: true,
    },
    {
        name: "last",
        label: "Last Name",
        type: "text",
        placeholder: "Enter last name",
        required: true,
    },
    {
        name: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "Enter phone number",
        required: true,
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter email address",
        required: true,
    },
    {
        name: "birth",
        label: "Birthday",
        type: "date",
        placeholder: "Enter birthday",
    },
    {
        name: "notes",
        label: "Notes",
        type: "textarea",
        placeholder: "Enter notes",
    },
];

const initialValues = {
    first: "",
    last: "",
    phone: "",
    email: "",
    notes: "",
    birthday: "",
};

const validationSchema = Yup.object({
    first: Yup.string().required("First name is required"),
    last: Yup.string().required("Last name is required"),
    phone: Yup.string()
        .matches(/^[0-9\-+() ]*$/, "Phone number is not valid")
        .min(7, "Phone number is too short")
        .required("Phone is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    notes: Yup.string(),
    birthday: Yup.date(),
});

const ClientForm = ({ open, setOpen }) => {
    const { user, setUser } = useUser();
    const company = user.selectedStore.companyId;

    //Create new client
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        // Replace with your API call or logic
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/clients`, {
                ...values,
                company,
            });
            resetForm();
            setOpen(false);
            // Optionally show a success message here
            toast.success("Client created!");
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
                title={`New Client`}
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

export default ClientForm;
