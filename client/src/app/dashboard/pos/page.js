"use client";

import React, { createContext, useState } from "react";
import TabProducts from "./TabProducts";
import Cart from "./Cart";
import { Breadcrumb, BreadcrumbItem, Button } from "flowbite-react";
import Link from "next/link";

import { useCart } from "../../context/cartContext";

export default function POSPage({ children }) {
    const [view, setView] = useState("pos"); // products, cart, checkout

    const { cart, setCart } = useCart();

    const total = cart?.items?.length;

    console.log(view);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="card flex flex-col w-full h-full max-h-full overflow-hidden">
                <div className="flex justify-between items-center">
                    <div className="title">POS</div>
                    <Breadcrumb aria-label="Breadcrumb" className="sm:hidden">
                        <BreadcrumbItem>Products & Services</BreadcrumbItem>
                        <BreadcrumbItem>Cart</BreadcrumbItem>
                        <BreadcrumbItem>Checkout</BreadcrumbItem>
                    </Breadcrumb>
                </div>

                <div className="flex-grow flex flex-col h-full max-h-full overflow-y-hidden overflow-x-hidden">
                    {view == "pos" && (
                        <>
                            <div className="flex flex-col h-full">
                                <div className="flex-grow flex overflow-y-auto">
                                    <div className="sm:py-3 sm:px-8 w-full">
                                        <TabProducts />
                                    </div>
                                    <div className="hidden sm:flex w-1/2">
                                        <Cart />
                                    </div>
                                </div>
                                <footer className="flex w-full mt-2 justify-end">
                                    <div
                                        onClick={() => setView("cart")}
                                        className={`btn-minimal ${
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
        </div>
    );
}
