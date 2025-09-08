import React, { useContext, useEffect, useState } from "react";
import ProductForm from "../forms/ProductForm.js";
import ServiceForm from "../forms/ServiceForm.js";
import axios from "axios";
import {
    MinusCircleIcon,
    PlusCircleIcon,
    PhotoIcon,
} from "@heroicons/react/16/solid";

import { useUser } from "../context/userContext.js";

function GridTable({ view, items, setItems, fetchProducts, fetchServices }) {
    const { user } = useUser;

    const [page, setPage] = useState(1);

    const [productModal, setProductModal] = useState({
        type: "New",
        open: false,
        page: 1,
    });
    const [productErrors, setProductErrors] = useState({});
    const [productForm, setProductForm] = useState({
        _id: "",
        name: "",
        description: "",
        price: "",
        inventory: "",
        images: [],
        favoriteImage: "",
    });

    const [serviceModal, setServiceModal] = useState({
        type: "New",
        open: false,
    });
    const [serviceErrors, setServiceErrors] = useState({});
    const [serviceForm, setServiceForm] = useState({
        _id: "",
        name: "",
        description: "",
        price: "",
        duration: 15,
        images: [],
        favoriteImage: "",
    });

    const increment = (id) => {
        setItems((prevItems) => {
            return prevItems.map((item) => {
                return item._id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item;
            });
        });
    };

    const decrement = (id) => {
        setItems((prevItems) => {
            return prevItems.map((item) => {
                return item._id === id
                    ? {
                          ...item,
                          quantity:
                              item.quantity - 1 >= 0 ? item.quantity - 1 : 0,
                      }
                    : item;
            });
        });
    };

    const handleCountChange = (e, id) => {
        setItems((prevItems) => {
            return prevItems.map((item) => {
                return item._id === id
                    ? {
                          ...item,
                          quantity:
                              item.quantity - 1 >= 0 ? item.quantity - 1 : 0,
                      }
                    : item;
            });
        });
    };

    const resetProductForm = () => {
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
            favoriteImage: "",
        });
    };

    const resetServiceForm = () => {
        setServiceModal({
            type: "New",
            open: false,
        });
        setServiceForm({
            _id: "",
            name: "",
            description: "",
            price: "",
            duration: 15,
            images: [],
            favoriteImage: "",
        });
    };

    const handleChange = (e) => {
        setProductForm({ ...productForm, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProductForm({
            ...productForm,
            images: [...productForm.images, ...Array.from(e.target.files)],
        });
    };

    const handleServiceFileChange = (e) => {
        setServiceForm({
            ...serviceForm,
            images: [...serviceForm.images, ...Array.from(e.target.files)],
        });
    };

    const validateProducts = () => {
        let newErrors = {};
        if (!productForm.name) newErrors.name = "Required";
        if (!productForm.price) newErrors.price = "Required";
        return newErrors;
    };

    const validateServices = () => {
        let newErrors = {};
        if (!serviceForm.name) newErrors.name = "Required";
        if (!serviceForm.price) newErrors.price = "Required";
        return newErrors;
    };

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        const validate = validateProducts();

        if (Object.keys(validate).length > 0) {
            setProductErrors(validate);
        } else {
            const selectedStore = user.stores.find(
                (item) => item.store._id === user.selectedStore
            );

            const formData = new FormData();
            formData.append(
                "favoriteImage",
                !productForm.favoriteImage ? "" : productForm.favoriteImage
            );
            formData.append("company", selectedStore.store.company._id);
            formData.append("name", productForm.name);
            formData.append("description", productForm.description);
            formData.append("price", productForm.price);
            formData.append(
                "inventory",
                productForm.inventory ? productForm.inventory : 0
            );
            productForm.images?.forEach((file) => {
                if (file.type === "url") {
                    formData.append("existingFiles", file.url);
                } else {
                    formData.append("files", file);
                }
            });

            if (type === "New") {
                //New
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_BASE_URL}/products`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    console.log(response);
                } catch (error) {
                    console.error(
                        "There was an error adding the product!",
                        error
                    );
                }
            } else if (type === "Edit") {
                //Update

                try {
                    const response = await axios.put(
                        `${process.env.REACT_APP_BASE_URL}/products/${productForm._id}`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                } catch (error) {
                    console.error(
                        "There was an error updating the product!",
                        error
                    );
                }
            }
            fetchProducts();
            resetProductForm();
        }
    };

    const handleProductDelete = async () => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_BASE_URL}/products/${productForm._id}`
            );

            fetchProducts();
            resetProductForm();
        } catch (err) {
            console.error("There was an error deleting the product", err);
        }
    };

    const handleServiceDelete = async () => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_BASE_URL}/services/${serviceForm._id}`
            );

            fetchServices();
            resetServiceForm();
        } catch (err) {
            console.error("There was an error deleting the service", err);
        }
    };

    const handleServiceChange = (e) => {
        setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        const validate = validateServices();

        if (Object.keys(validate).length > 0) {
            setServiceErrors(validate);
        } else {
            const selectedStore = user.stores.find(
                (item) => item.store._id === user.selectedStore
            );
            const serviceData = new FormData();
            serviceData.append(
                "favoriteImage",
                !serviceForm.favoriteImage ? "" : serviceForm.favoriteImage
            );
            serviceData.append("company", selectedStore.store.company);
            serviceData.append("name", serviceForm.name);
            serviceData.append("description", serviceForm.description);
            serviceData.append("price", serviceForm.price);
            serviceData.append("duration", serviceForm.duration);
            serviceForm.images?.forEach((file) => {
                if (file.type === "url") {
                    serviceData.append("existingFiles", file.url);
                } else {
                    serviceData.append("files", file);
                }
            });

            try {
                if (serviceModal.type === "New") {
                    await axios
                        .post(
                            `${process.env.REACT_APP_BASE_URL}/services`,
                            serviceData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        )
                        .then((response) => {
                            fetchServices();
                        })
                        .catch((error) => {
                            console.error(
                                "There was an error adding the service!",
                                error
                            );
                        });
                }

                if (serviceModal.type === "Edit") {
                    try {
                        const response = await axios.put(
                            `${process.env.REACT_APP_BASE_URL}/services/${serviceForm._id}`,
                            serviceData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );
                    } catch (error) {
                        console.error(
                            "There was an error updating the Service!",
                            error
                        );
                    }
                }
                fetchServices();
                resetServiceForm();
            } catch (err) {
                console.log(err);
            }
        }
        return;
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full  max-h-full overflow-y-auto px-1">
            {items.map((item, i) => {
                return (
                    <div
                        key={i}
                        className="h-64 sm: w-full lg:h-64 flex flex-col rounded-sm  bg-white   cursor-pointer border border-gray-200 "
                    >
                        <div
                            onClick={() => {
                                if (view === "Products") {
                                    setProductModal({
                                        type: "Read",
                                        open: true,
                                        page: 1,
                                    });

                                    setProductForm(item);
                                }

                                if (view === "Services") {
                                    setServiceModal({
                                        type: "Read",
                                        open: true,
                                    });

                                    setServiceForm(item);
                                }
                            }}
                            className="image flex-grow rounded-t-sm overflow-hidden  "
                        >
                            {item.images.length > 0 ? (
                                <>
                                    <img
                                        className="object-cover w-full h-full"
                                        src={`${
                                            process.env.REACT_APP_BASE_URL
                                        }${
                                            item.favoriteImage
                                                ? item.favoriteImage
                                                : item.images[0].url
                                        }`}
                                        alt=""
                                    />
                                </>
                            ) : (
                                <div className="flex px-2 text-white justify-center items-center h-full text-center bg-neutral-200">
                                    <PhotoIcon className="h-10" />
                                </div>
                            )}
                        </div>
                        <div className=" p-1">
                            <div className="px-2 pt-2 w-full max-w-full">
                                <div className="text-lg  text-gray-600 overflow-x-hidden text-overflow whitespace-nowrap text-ellipsis">
                                    {item.name}
                                </div>
                                <div className="text-sm sm:text-base">
                                    ${item.price}
                                </div>
                            </div>
                            <div className="flex justify-center ">
                                <form className="max-w-xs mx-auto w-full flex justify-center">
                                    <div className="relative flex items-center ">
                                        <button
                                            type="button"
                                            id="decrement-button"
                                            className=" rounded-sm text-white "
                                            onClick={() => decrement(item._id)}
                                        >
                                            <MinusCircleIcon className="h-5 sm:h-6 text-gray-400" />
                                        </button>
                                        <input
                                            type="text"
                                            id="counter-input"
                                            data-input-counter
                                            className=" text-gray-900 border-0 bg-transparent text-sm sm:text-base font-normal max-w-[2.5rem] text-center "
                                            placeholder=""
                                            onChange={(e) =>
                                                handleCountChange(e, item._id)
                                            }
                                            value={
                                                item.quantity
                                                    ? item.quantity
                                                    : 0
                                            }
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            id="increment-button"
                                            className="rounded-sm text-white "
                                            onClick={() => increment(item._id)}
                                        >
                                            <PlusCircleIcon className="h-5 sm:h-6 text-gray-400" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            })}

            <ProductForm
                productErrors={productErrors}
                setProductErrors={setProductErrors}
                validateProducts={validateProducts}
                productModal={productModal}
                setProductModal={setProductModal}
                productForm={productForm}
                setProductForm={setProductForm}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleFileChange={handleFileChange}
                handleProductDelete={handleProductDelete}
            />
            <ServiceForm
                serviceModal={serviceModal}
                setServiceModal={setServiceModal}
                serviceForm={serviceForm}
                setServiceForm={setServiceForm}
                serviceErrors={serviceErrors}
                handleServiceChange={handleServiceChange}
                handleServiceSubmit={handleServiceSubmit}
                handleServiceDelete={handleServiceDelete}
                handleServiceFileChange={handleServiceFileChange}
            />
        </div>
    );
}

export default GridTable;
