import React, { useState } from "react";
import { Modal, Tabs, FileInput, Label, Select } from "flowbite-react";
import {
    StarIcon as OutlineStarIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon } from "@heroicons/react/16/solid";

const Component = ({
    serviceModal,
    setServiceModal,
    serviceForm,
    setServiceForm,
    serviceErrors,
    handleServiceChange,
    handleServiceSubmit,
    handleServiceDelete,
    handleServiceFileChange,
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
            base: "py-0",
            variant: {
                default: "",
                underline: "",
                pills: "",
                fullWidth: "",
            },
        },
        tabpanel: "py-0",
    };

    return (
        <>
            <Modal
                show={serviceModal.open}
                size="md"
                popup
                onClose={() => {
                    setServiceModal({
                        type: "New",
                        open: false,
                    });
                    setServiceForm({
                        _id: "",
                        name: "",
                        price: "",
                        duration: 15,
                        description: "",
                        images: [],
                        favoriteImage: "",
                    }); // Reset form
                }}
            >
                <Modal.Header className="ml-2">Service</Modal.Header>
                <Modal.Body>
                    <Tabs theme={theme} variant="underline">
                        <Tabs.Item title="Details">
                            <form
                                className="pt-2 flex flex-col"
                                onSubmit={handleServiceSubmit}
                            >
                                <div className="flex-grow">
                                    {serviceModal.type !== "Read" && (
                                        <Label
                                            htmlFor="dropzone-file"
                                            className="mb-4 flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                        >
                                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                                <svg
                                                    className="mb-4 h-5 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>

                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    SVG, PNG, JPG or GIF (MAX.
                                                    800x400px)
                                                </p>
                                            </div>
                                            <FileInput
                                                multiple
                                                id="dropzone-file"
                                                className="hidden"
                                                name="images"
                                                onChange={
                                                    handleServiceFileChange
                                                }
                                            />
                                        </Label>
                                    )}

                                    <div className="relative mb-2 grid grid-cols-2 gap-1">
                                        {serviceForm.images.map(
                                            (file, index) => (
                                                <div key={index} className="">
                                                    <div
                                                        key={index}
                                                        className="h-32 relative bg-gray-200 flex justify-center overflow-hidden w-full  "
                                                    >
                                                        {file.type === "url" ? (
                                                            <img
                                                                src={`${process.env.REACT_APP_BASE_URL}${file.url}`}
                                                                alt={file}
                                                                className="h-full w-full object-cover "
                                                            />
                                                        ) : (
                                                            <img
                                                                src={URL.createObjectURL(
                                                                    file
                                                                )}
                                                                alt={file.name}
                                                                className="h-full w-full object-cover "
                                                            />
                                                        )}
                                                        {serviceModal.type !==
                                                            "Read" && (
                                                            <>
                                                                <div
                                                                    onClick={() => {
                                                                        const updatedImages =
                                                                            serviceForm.images.filter(
                                                                                (
                                                                                    img,
                                                                                    j
                                                                                ) => {
                                                                                    return (
                                                                                        index !==
                                                                                        j
                                                                                    );
                                                                                }
                                                                            );
                                                                        setServiceForm(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                images: updatedImages,
                                                                            })
                                                                        );
                                                                    }}
                                                                    className="bg-red-500 absolute top-1 left-1 rounded-full p-1"
                                                                >
                                                                    <TrashIcon className="h-4  text-white" />
                                                                </div>
                                                            </>
                                                        )}

                                                        {serviceModal.type ===
                                                            "Edit" && (
                                                            <div
                                                                onClick={() => {
                                                                    setServiceForm(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            favoriteImage:
                                                                                file.url,
                                                                        })
                                                                    );
                                                                }}
                                                                className="bg-yellow-400 absolute top-1 right-1 rounded-full p-1"
                                                            >
                                                                {serviceForm.favoriteImage ===
                                                                file.url ? (
                                                                    <SolidStarIcon className="h-4 text-white" />
                                                                ) : (
                                                                    <OutlineStarIcon className="h-4 text-white" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div
                                        className={`col-span-2 sm:col-span-1 mt-5 border-t py-3`}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="name"
                                                className="font-medium text-gray-700 dark:text-white text-lg"
                                            >
                                                Title{" "}
                                            </label>
                                            {serviceModal.type !== "Read" && (
                                                <div
                                                    className={`text-xs font-extralight`}
                                                >
                                                    Required
                                                </div>
                                            )}
                                        </div>

                                        {serviceModal.type === "Read" ? (
                                            <p className="text-base text-gray-700">
                                                {serviceForm.name}
                                            </p>
                                        ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Enter name "
                                                    value={serviceForm.name}
                                                    onChange={
                                                        handleServiceChange
                                                    }
                                                />
                                                {serviceErrors.name && (
                                                    <p className="text-red-500 text-sm">
                                                        {serviceErrors.name}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`col-span-2 sm:col-span-1 ${
                                            serviceModal.type === "Read"
                                                ? "border-t"
                                                : ""
                                        } py-3`}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="price"
                                                className="font-medium text-lg text-gray-700 dark:text-white"
                                            >
                                                Price{" "}
                                            </label>
                                            {serviceModal.type !== "Read" && (
                                                <div
                                                    className={`text-xs font-extralight`}
                                                >
                                                    Required
                                                </div>
                                            )}
                                        </div>
                                        {serviceModal.type === "Read" ? (
                                            <div className="text-base text-gray-700">
                                                {serviceForm.price}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative w-full overflow-hidden">
                                                    <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
                                                        <svg
                                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 20 16"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        step={0.01}
                                                        id="currency-input"
                                                        className="ps-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Enter amount"
                                                        value={
                                                            serviceForm.price
                                                        }
                                                        onChange={
                                                            handleServiceChange
                                                        }
                                                    />
                                                </div>

                                                {serviceErrors.price && (
                                                    <p className="text-red-500 text-sm">
                                                        {serviceErrors.price}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`col-span-2 sm:col-span-1  ${
                                            serviceModal.type === "Read"
                                                ? "border-t"
                                                : ""
                                        } py-3`}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="description"
                                                className="mb-1 text-lg font-medium text-gray-700 dark:text-white"
                                            >
                                                Description{" "}
                                            </label>
                                        </div>

                                        {serviceModal.type === "Read" ? (
                                            <div className="text-gray-700 text-sm">
                                                {serviceForm.description
                                                    ? serviceForm.description
                                                    : "-"}
                                            </div>
                                        ) : (
                                            <textarea
                                                type="text"
                                                name="description"
                                                id="description"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Enter service description "
                                                value={serviceForm.description}
                                                onChange={handleServiceChange}
                                            />
                                        )}
                                    </div>

                                    <div
                                        className={`col-span-2 sm:col-span-1 py-3 ${
                                            serviceModal.type === "Read"
                                                ? "border-t"
                                                : ""
                                        } `}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="duration"
                                                className=" text-lg font-medium text-gray-700 dark:text-white"
                                            >
                                                Duration{" "}
                                            </label>
                                        </div>
                                        {serviceModal.type === "Read" ? (
                                            <div className="text-md text-gray-700">
                                                {serviceForm.duration}
                                            </div>
                                        ) : (
                                            <Select
                                                name="duration"
                                                id="duration"
                                                value={
                                                    serviceForm.duration || 15
                                                }
                                                onChange={handleServiceChange}
                                                required
                                            >
                                                <option value="15">
                                                    15 minutes
                                                </option>
                                                <option value="30">
                                                    30 minutes
                                                </option>
                                                <option value="45">
                                                    45 minutes
                                                </option>
                                                <option value="60">
                                                    1 hour
                                                </option>
                                                <option value="75">
                                                    1 hour 15 minutes
                                                </option>
                                                <option value="90">
                                                    1 hour 30 minutes
                                                </option>
                                                <option value="105">
                                                    1 hour 45 minutes
                                                </option>
                                                <option value="120">
                                                    2 hours
                                                </option>
                                                <option value="135">
                                                    2 hours 15 minutes
                                                </option>
                                                <option value="150">
                                                    2 hours 30 minutes
                                                </option>
                                                <option value="165">
                                                    2 hours 45 minutes
                                                </option>
                                                <option value="180">
                                                    3 hours
                                                </option>
                                                <option value="195">
                                                    3 hours 15 minutes
                                                </option>
                                                <option value="210">
                                                    3 hours 30 minutes
                                                </option>
                                                <option value="225">
                                                    3 hours 45 minutes
                                                </option>
                                                <option value="240">
                                                    4 hours
                                                </option>
                                                <option value="255">
                                                    4 hours 15 minutes
                                                </option>
                                                <option value="270">
                                                    4 hours 30 minutes
                                                </option>
                                                <option value="285">
                                                    4 hours 45 minutes
                                                </option>
                                                <option value="300">
                                                    5 hours
                                                </option>
                                                <option value="315">
                                                    5 hours 15 minutes
                                                </option>
                                                <option value="330">
                                                    5 hours 30 minutes
                                                </option>
                                                <option value="345">
                                                    5 hours 45 minutes
                                                </option>
                                                <option value="360">
                                                    6 hours
                                                </option>
                                                <option value="375">
                                                    6 hours 15 minutes
                                                </option>
                                                <option value="390">
                                                    6 hours 30 minutes
                                                </option>
                                                <option value="405">
                                                    6 hours 45 minutes
                                                </option>
                                                <option value="420">
                                                    7 hours
                                                </option>
                                                <option value="435">
                                                    7 hours 15 minutes
                                                </option>
                                                <option value="450">
                                                    7 hours 30 minutes
                                                </option>
                                                <option value="465">
                                                    7 hours 45 minutes
                                                </option>
                                                <option value="480">
                                                    8 hours
                                                </option>
                                            </Select>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-5">
                                    {serviceModal.type === "Read" && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setServiceModal((prev) => ({
                                                    ...prev,
                                                    type: "Edit",
                                                }));
                                            }}
                                            className="bg-gray-400 py-2 px-4 rounded-sm text-white"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {serviceModal.type === "New" && (
                                        <button className="bg-rose-400 py-2 px-4 rounded-sm text-white">
                                            Save
                                        </button>
                                    )}

                                    {serviceModal.type === "Edit" && (
                                        <div className="flex w-full justify-between">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleServiceDelete();
                                                }}
                                                className="bg-gray-400 py-2 px-4 rounded-sm text-white"
                                            >
                                                Delete
                                            </button>
                                            <button className="bg-rose-400 py-2 px-4 rounded-sm text-white">
                                                Update
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </Tabs.Item>
                    </Tabs>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Component;
