import React, { useState } from "react";
import { Modal, Tabs, List, Avatar } from "flowbite-react";

const CustomerForm = ({
    formType,
    setFormType,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    errors,
    openModal,
    setOpenModal,
    handleDelete,
}) => {
    const theme = {
        base: "flex flex-col gap-2",
        tablist: {
            base: "flex text-center",
            variant: {
                default:
                    "flex-wrap border-b border-gray-200 dark:border-gray-700",
                underline:
                    "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
                pills: "flex-wrap space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400",
                fullWidth:
                    "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400",
            },
            tabitem: {
                base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
                variant: {
                    default: {
                        base: "rounded-t-lg",
                        active: {
                            on: "bg-gray-100 text-cyan-600 dark:bg-gray-800 dark:text-cyan-500",
                            off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                        },
                    },
                    underline: {
                        base: "rounded-t-lg",
                        active: {
                            on: "active rounded-t-lg border-b-2 border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500",
                            off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
                        },
                    },
                    pills: {
                        base: "",
                        active: {
                            on: "rounded-lg bg-cyan-600 text-white",
                            off: "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
                        },
                    },
                    fullWidth: {
                        base: "ml-0 flex w-full rounded-none first:ml-0",
                        active: {
                            on: "active rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white",
                            off: "rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white",
                        },
                    },
                },
                icon: "mr-2 h-5 w-5",
            },
        },
        tabitemcontainer: {
            base: "",
            variant: {
                default: "",
                underline: "",
                pills: "",
                fullWidth: "",
            },
        },
        tabpanel: "py-3",
    };

    return (
        <>
            <Modal
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
                        notes: "",
                    }); // Reset form
                }}
            >
                <Modal.Header className="ml-2">Customer Profile</Modal.Header>
                <Modal.Body>
                    <Tabs
                        theme={theme}
                        aria-label="Tabs with underline"
                        variant="underline"
                    >
                        <Tabs.Item title="Profile">
                            <form
                                className=" flex flex-col"
                                onSubmit={handleSubmit}
                            >
                                <div className="flex-grow mt-3">
                                    <div className="mb-3">
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="first"
                                                className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                First Name{" "}
                                            </label>
                                            <div
                                                className={`${
                                                    formType === "Read"
                                                        ? "hidden "
                                                        : ""
                                                } text-xs font-extralight`}
                                            >
                                                Required
                                            </div>
                                        </div>

                                        {formType === "New" ||
                                        formType === "Edit" ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="first"
                                                    id="first"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Enter customer first name"
                                                    value={formData.first}
                                                    onChange={handleChange}
                                                />
                                                {errors.first && (
                                                    <p className="text-red-500 text-sm">
                                                        {errors.first}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p>{formData.first}</p>
                                        )}
                                    </div>

                                    <div className="col-span-2 sm:col-span-1 mb-3">
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="last"
                                                className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Last Name{" "}
                                            </label>
                                            <div
                                                className={`${
                                                    formType === "Read"
                                                        ? "hidden "
                                                        : ""
                                                } text-xs font-extralight`}
                                            >
                                                Required
                                            </div>
                                        </div>

                                        {formType === "New" ||
                                        formType === "Edit" ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="last"
                                                    id="last"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Enter customer last name"
                                                    value={formData.last}
                                                    onChange={handleChange}
                                                />
                                                {errors.first && (
                                                    <p className="text-red-500 text-sm">
                                                        {errors.last}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p>{formData.last}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}

                                    <div className="col-span-2 sm:col-span-1 mb-3">
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="firstName"
                                                className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Email{" "}
                                            </label>
                                            <div
                                                className={`${
                                                    formType === "Read"
                                                        ? "hidden "
                                                        : ""
                                                } text-xs font-extralight`}
                                            >
                                                Required
                                            </div>
                                        </div>

                                        {formType === "New" ||
                                        formType === "Edit" ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Enter customer email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                                {errors.first && (
                                                    <p className="text-red-500 text-sm">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <p>{formData.email}</p>
                                        )}
                                    </div>

                                    {/* Phone Field */}

                                    <div className="col-span-2 sm:col-span-1 mb-3">
                                        <label
                                            htmlFor="phone"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Phone Number
                                        </label>

                                        {formType === "New" ||
                                        formType === "Edit" ? (
                                            <input
                                                type="text"
                                                name="phone"
                                                id="phone"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Enter customer phone number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            <p>{formData.phone}</p>
                                        )}
                                    </div>

                                    {/* Notes */}

                                    <div className="col-span-2 sm:col-span-1 mb-3">
                                        <label
                                            htmlFor="phone"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Notes
                                        </label>

                                        {formType === "New" ||
                                        formType === "Edit" ? (
                                            <textarea
                                                type="text"
                                                name="notes"
                                                id="notes"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder=""
                                                value={formData.notes}
                                                onChange={handleChange}
                                                rows={4}
                                            />
                                        ) : (
                                            <p>{formData.notes}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFormType("Edit");
                                        }}
                                        className={`${
                                            formType == "Read" ? "" : "hidden "
                                        } px-4 w-1/2 py-2 bg-gray-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`${
                                            formType === "Read" ? "hidden" : ""
                                        } px-4 w-1/2 py-2 bg-rose-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer`}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </Tabs.Item>

                        <Tabs.Item
                            title={`${
                                formType === "New" ? "" : "Transactions"
                            } `}
                        >
                            <div>
                                <List
                                    unstyled
                                    className="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
                                >
                                    <List.Item className="pb-3 sm:pb-4">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    #123154895
                                                </p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                    1/25/2025
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                $320
                                            </div>
                                        </div>
                                    </List.Item>
                                    <List.Item className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    #123154896
                                                </p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                    1/20/2025
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                $346
                                            </div>
                                        </div>
                                    </List.Item>
                                    <List.Item className="py-3 sm:pb-4">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    #123154894
                                                </p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                    1/25/2025
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                $320
                                            </div>
                                        </div>
                                    </List.Item>
                                    <List.Item className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    #123154895
                                                </p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                    1/20/2025
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                $346
                                            </div>
                                        </div>
                                    </List.Item>
                                    <List.Item className="py-3 sm:pb-4">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    #123154895
                                                </p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                    1/25/2025
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                $320
                                            </div>
                                        </div>
                                    </List.Item>
                                    <List.Item className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    #123154895
                                                </p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                    1/20/2025
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                $346
                                            </div>
                                        </div>
                                    </List.Item>
                                </List>
                            </div>
                        </Tabs.Item>
                        <Tabs.Item title="">
                            <div className="w-full bg-gray-400 rounded-sm py-2 px-4 text-white text-center">
                                <button onClick={handleDelete}>
                                    Delete Customer
                                </button>
                            </div>
                        </Tabs.Item>
                    </Tabs>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CustomerForm;
