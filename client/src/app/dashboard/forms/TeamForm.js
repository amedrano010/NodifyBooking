import React, { useState } from "react";
import { Modal, Tabs, List, Avatar } from "flowbite-react";
import {
    Button,
    Checkbox,
    FileInput,
    Label,
    Radio,
    RangeSlider,
    Select,
    Textarea,
    TextInput,
    ToggleSwitch,
} from "flowbite-react";

const TeamForm = ({ openModal, setOpenModal, formType }) => {
    const theme = {
        root: {
            base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
            show: {
                on: "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
                off: "hidden",
            },
            sizes: {
                sm: "max-w-sm",
                md: "max-w-md",
                lg: "max-w-lg",
                xl: "max-w-xl",
                "2xl": "max-w-2xl",
                "3xl": "max-w-3xl",
                "4xl": "max-w-4xl",
                "5xl": "max-w-5xl",
                "6xl": "max-w-6xl",
                "7xl": "max-w-7xl",
            },
            positions: {
                "top-left": "items-start justify-start",
                "top-center": "items-start justify-center",
                "top-right": "items-start justify-end",
                "center-left": "items-center justify-start",
                center: "items-center justify-center",
                "center-right": "items-center justify-end",
                "bottom-right": "items-end justify-end",
                "bottom-center": "items-end justify-center",
                "bottom-left": "items-end justify-start",
            },
        },
        content: {
            base: "relative h-full w-full p-4 md:h-auto",
            inner: "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
        },
        body: {
            base: "flex-1 overflow-auto p-6",
            popup: "pt-0",
        },
        header: {
            base: "flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600",
            popup: "border-b-0 p-2",
            title: "text-xl font-medium text-gray-900 dark:text-white",
            close: {
                base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
                icon: "h-5 w-5",
            },
        },
        footer: {
            base: "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
            popup: "border-t",
        },
    };

    const [formData, setFormData] = useState({
        first: "",
        last: "",
        email: "",
        phone: "",
        services: [],
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate inputs
    const validate = () => {
        let newErrors = {};
        if (!formData.first) newErrors.first = "Required";
        if (!formData.last) newErrors.last = "Required";
        if (!formData.role) newErrors.role = "Required";
        if (
            !formData.phone ||
            formData.phone.length < 10 ||
            formData.phone.length > 10
        )
            newErrors.phone = "Valid phone required";
        if (!formData.email.includes("@"))
            newErrors.email = "Valid email required";

        return newErrors;
    };

    // Handle form submission
    const handleSubmit = (e, id) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            //if new, add to array
            if (formType === "New") {
                setFormData((prev) => [...prev, formData]);
            } else if (formType === "Edit") {
                //if edit, update object
                setFormData((prevData) =>
                    prevData.map((item) =>
                        item.id === formData.id ? { ...formData } : item
                    )
                );
            }

            resetForm();
        }
    };

    const resetForm = (e) => {
        setFormData({
            first: "",
            last: "",
            email: "",
            phone: "",
            role: "",
            avatar: "",
        }); // Reset form
        setErrors({});
        setOpenModal(false);
    };

    return (
        <>
            <Modal
                theme={theme}
                show={openModal}
                size="md"
                popup
                onClose={() => {
                    setOpenModal(false);
                    setFormData({
                        first: "",
                        last: "",
                        email: "",
                        phone: "",
                        services: "",
                    }); // Reset form
                }}
            >
                <Modal.Header className="ml-2">New Team Member</Modal.Header>
                <Modal.Body>
                    <form>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="email"
                                    value="Email"
                                    className="text-md text-gray-800"
                                />
                            </div>
                            <TextInput
                                id="first"
                                type="text"
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div className="flex mt-2">
                            <div className="bg-rose-400 py-2 px-4 text-white rounded-md">
                                Send invite link
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TeamForm;
