"use client";

import React, { createContext, useState } from "react";
import TabProducts from "./components/ui/TabProducts";
import Cart from "./components/ui/Cart";
import { Breadcrumb, BreadcrumbItem, Button } from "flowbite-react";
import Link from "next/link";

import { useCart } from "/app/dashboard/context/cartContext";

export default function POSPage({ children }) {
    const [view, setView] = useState("pos"); // products, cart, checkout

    const { cart, setCart } = useCart();

    const total = cart?.items?.length;

    return (
        <div className="card flex flex-col w-full h-full max-h-full overflow-hidden">
            <div className="flex justify-between items-center">
                <Breadcrumb aria-label="Breadcrumb" className="sm:hidden">
                    <BreadcrumbItem>Products & Services</BreadcrumbItem>
                    <BreadcrumbItem>Cart</BreadcrumbItem>
                    <BreadcrumbItem>Checkout</BreadcrumbItem>
                </Breadcrumb>
            </div>

            <div className="flex-grow flex flex-col h-full max-h-full overflow-y-hidden overflow-x-hidden">
                {view == "pos" && (
                    <>
                        <div className="flex flex-col h-full w-full">
                            <div className="flex-grow flex overflow-y-auto overflow-x-hidden sm:gap-8 ">
                                <div className="w-full  sm:w-2/3 ">
                                    <TabProducts />
                                </div>
                                <div className="hidden sm:flex w-1/3">
                                    <Cart />
                                </div>
                            </div>
                            <footer className="flex w-full mt-2 justify-end">
                                <div
                                    onClick={() => setView("cart")}
                                    className={`btn-secondary sm:hidden${
                                        total === 0
                                            ? "cursor-not-allowed opacity-80"
                                            : ""
                                    }`}
                                >
                                    View Cart {total ? `(${total})` : ""}
                                </div>
                            </footer>
                        </div>
                    </>
                )}

                {view == "cart" && (
                    <>
                        <Cart setView={setView} />
                    </>
                )}
            </div>
        </div>
    );
}
