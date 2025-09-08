import React, { useState } from "react";
import { Modal, Tabs, FileInput, Label } from "flowbite-react";
import {
    TrashIcon,
    StarIcon as OutlineStarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon } from "@heroicons/react/16/solid";

const ProductForm = ({
    productErrors,
    productModal,
    setProductModal,
    productForm,
    setProductForm,
    handleChange,
    handleSubmit,
    handleFileChange,
    validateProducts,
    setProductErrors,
    handleProductDelete,
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
        tabpanel: "py-0",
    };

    const inventoryDecrement = (id) => {
        setProductForm({
            ...productForm,
            inventory:
                productForm.inventory * 1 - 1 >= 0
                    ? productForm.inventory * 1 - 1
                    : 0,
        });
    };

    const inventoryIncrement = (id) => {
        setProductForm({
            ...productForm,
            inventory: productForm.inventory * 1 + 1,
        });
    };

    return (
        <>
            <Modal
                show={productModal.open}
                size="md"
                popup
                onClose={() => {
                    setProductModal({
                        type: "New",
                        open: false,
                        page: 1,
                    });
                    setProductForm({
                        _id: "",
                        name: "",
                        description: "",
                        price: "",
                        inventory: "",
                        images: [],
                    }); // Reset form
                    setProductErrors({});
                }}
            >
                <Modal.Header className="ml-2">Product</Modal.Header>
                <Modal.Body>
                    <Tabs
                        theme={theme}
                        aria-label="Tabs with underline"
                        variant="underline"
                    >
                        <Tabs title="Details" className="item">
                            <form
                                className=" flex flex-col"
                                onSubmit={(e) =>
                                    handleSubmit(e, productModal.type)
                                }
                                encType="multipart/form-data"
                            >
                                <div className="h-full">
                                    {productModal.type !== "Read" && (
                                        <Label
                                            htmlFor="dropzone-file"
                                            className="flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                                                onChange={handleFileChange}
                                            />
                                        </Label>
                                    )}

                                    <div className="relative mt-2 grid grid-cols-2 gap-1">
                                        {productForm.images.map(
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
                                                        {productModal.type !==
                                                            "Read" && (
                                                            <>
                                                                <div
                                                                    onClick={() => {
                                                                        const updatedImages =
                                                                            productForm.images.filter(
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
                                                                        setProductForm(
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

                                                        {productModal.type ===
                                                            "Edit" && (
                                                            <div
                                                                onClick={() => {
                                                                    setProductForm(
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
                                                                {productForm.favoriteImage ===
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
                                </div>
                                <div className="flex-grow mt-3">
                                    <div
                                        className={`col-span-2 sm:col-span-1 border-t py-3 `}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="name"
                                                className="text-lg font-medium text-gray-700 dark:text-white"
                                            >
                                                Title{" "}
                                            </label>
                                            {productModal.type !== "Read" && (
                                                <div
                                                    className={`text-xs font-extralight`}
                                                >
                                                    Required
                                                </div>
                                            )}
                                        </div>

                                        {productModal.type === "Read" ? (
                                            <div className="text-base text-gray-700">
                                                {productForm.name}
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Enter name "
                                                value={productForm.name}
                                                onChange={handleChange}
                                            />
                                        )}

                                        {productErrors.name && (
                                            <p className="text-red-500 text-sm">
                                                {productErrors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        className={`col-span-2 sm:col-span-1 ${
                                            productModal.type === "Read"
                                                ? "border-t"
                                                : ""
                                        } py-3 `}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="price"
                                                className="text-lg font-medium text-gray-700 dark:text-white"
                                            >
                                                Price{" "}
                                            </label>
                                            {productModal.type !== "Read" && (
                                                <div
                                                    className={`text-xs font-extralight`}
                                                >
                                                    Required
                                                </div>
                                            )}
                                        </div>

                                        {productModal.type === "Read" ? (
                                            <div className="text-base text-gray-700">
                                                {productForm.price}
                                            </div>
                                        ) : (
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
                                                    step={0.01}
                                                    id="currency-input"
                                                    name="price"
                                                    className="ps-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Enter amount"
                                                    value={productForm.price}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        )}

                                        {productErrors.price && (
                                            <p className="text-red-500 text-sm">
                                                {productErrors.price}
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        className={`col-span-2 sm:col-span-1  py-3 ${
                                            productModal.type === "Read"
                                                ? "border-t"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="description"
                                                className="text-lg font-medium text-gray-700 dark:text-white"
                                            >
                                                Description{" "}
                                            </label>
                                        </div>

                                        {productModal.type === "Read" ? (
                                            <div className="text-base text-gray-700">
                                                {productForm.description
                                                    ? productForm.description
                                                    : "NA"}
                                            </div>
                                        ) : (
                                            <textarea
                                                type="text"
                                                name="description"
                                                id="description"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Enter product description "
                                                value={productForm.description}
                                                onChange={handleChange}
                                            />
                                        )}
                                    </div>

                                    <div
                                        className={`col-span-2 sm:col-span-1 ${
                                            productModal.type === "Read"
                                                ? "border-t"
                                                : ""
                                        } py-3`}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <label
                                                htmlFor="quantity-input"
                                                className="text-lg font-medium text-gray-700 dark:text-white"
                                            >
                                                Inventory{" "}
                                            </label>
                                        </div>

                                        {productModal.type === "Read" ? (
                                            <div className="text-base text-gray-700">
                                                {productForm.inventory
                                                    ? productForm.inventory
                                                    : "NA"}
                                            </div>
                                        ) : (
                                            <div className="relative flex items-center max-w-[8rem]">
                                                <button
                                                    onClick={(e) =>
                                                        inventoryDecrement(
                                                            e,
                                                            productForm._id
                                                        )
                                                    }
                                                    type="button"
                                                    id="decrement-button"
                                                    data-input-counter-decrement="quantity-input"
                                                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                                >
                                                    <svg
                                                        className="w-3 h-3 text-gray-900 dark:text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 18 2"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M1 1h16"
                                                        />
                                                    </svg>
                                                </button>
                                                <input
                                                    type="text"
                                                    id="inventory"
                                                    name="inventory"
                                                    data-input-counter
                                                    aria-describedby="helper-text-explanation"
                                                    className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="999"
                                                    value={
                                                        productForm.inventory
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    onClick={(e) =>
                                                        inventoryIncrement(
                                                            e,
                                                            productForm._id
                                                        )
                                                    }
                                                    type="button"
                                                    id="increment-button"
                                                    data-input-counter-increment="quantity-input"
                                                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                                >
                                                    <svg
                                                        className="w-3 h-3 text-gray-900 dark:text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 18 18"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 1v16M1 9h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-5">
                                    {productModal.type === "Read" && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setProductModal((prev) => ({
                                                    ...prev,
                                                    type: "Edit",
                                                }));
                                            }}
                                            className="bg-gray-400 py-2 px-4 rounded-sm text-white"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {productModal.type === "New" && (
                                        <button className="bg-rose-400 py-2 px-4 rounded-sm text-white">
                                            Submit
                                        </button>
                                    )}

                                    {productModal.type === "Edit" && (
                                        <div className="flex w-full justify-between">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleProductDelete();
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
                        </Tabs>
                    </Tabs>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ProductForm;
