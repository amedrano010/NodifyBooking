"use client";

import { Tabs, TabItem } from "flowbite-react";
import { useState } from "react";
import GridTable from "./GridTable";
import { ShoppingBagIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect } from "react";
import { CartContext } from "../dashboard/context/cartContext";
import axios from "axios";
import { UserContext } from "../dashboard/context/userContext";

export default function Component() {
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const { user } = useContext(UserContext);

    console.log(user);
    const { cart, setCart } = useContext(CartContext);

    const theme = {
        base: "flex flex-col gap-2 h-full max-h-full overflow-hidden",
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
            base: "flex flex-col max-h-full h-full overflow-hidden",
            variant: {
                default: "",
                underline: "",
                pills: "",
                fullWidth: "",
            },
        },
        tabpanel: "h-full overflow-hidden",
    };

    const [products, setProducts] = useState([]);

    const [services, setServices] = useState([]);

    useEffect(() => {
        let cart = products
            .concat(services)
            .filter((item) => item.quantity > 0);

        setCart(cart);
    }, [setCart, products, services]);

    let company;
    if (user && user._id) {
        const currentStore = user?.stores?.find(
            (item) => item.store._id === user.selectedStore
        );
        company = currentStore?.store?.company;
    }

    const fetchProducts = async () => {
        return;
        if (user && user._id) {
            await axios
                .get(`${baseUrl}/products`, {
                    params: {
                        company: company,
                    },
                })
                .then((response) => {
                    setProducts(() => {
                        return response.data.map((item) => {
                            let arrImages = item.product.images.map(
                                (image) => ({
                                    url: image,
                                    type: "url",
                                })
                            );

                            return {
                                ...item.product,
                                quantity: 0,
                                images: arrImages,
                            };
                        });
                    });
                })
                .catch((error) => {
                    console.error(
                        "There was an error fetching the products!",
                        error
                    );
                });
        }
    };
    useEffect(() => {
        fetchProducts();
    }, [user]);

    const fetchServices = async () => {
        if (user && user._id) {
            await axios
                .get(`${baseUrl}/services`, {
                    params: {
                        company: company,
                    },
                })
                .then((res) => {
                    setServices(() => {
                        return res.data.map((item) => {
                            return {
                                ...item.service,
                                quantity: 0,
                                images: item.service.images.map((image) => ({
                                    url: image,
                                    type: "url",
                                })),
                            };
                        });
                    });
                })
                .catch((error) => {
                    console.error(
                        "There was an error fetching the services!",
                        error
                    );
                });
        }
    };

    useEffect(() => {
        fetchServices();
    }, [user]);

    return (
        <Tabs
            theme={theme}
            aria-label="Tabs with underline"
            variant="underline"
        >
            <TabItem title={`Products`} icon={ShoppingBagIcon}>
                <GridTable
                    view={"Products"}
                    items={products}
                    setItems={setProducts}
                    fetchProducts={fetchProducts}
                />
            </TabItem>
            <TabItem title={`Services`} icon={SparklesIcon}>
                <GridTable
                    view={"Services"}
                    items={services}
                    setItems={setServices}
                    fetchServices={fetchServices}
                />
            </TabItem>
        </Tabs>
    );
}
