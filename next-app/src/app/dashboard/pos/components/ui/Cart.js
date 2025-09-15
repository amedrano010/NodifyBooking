import React, { useContext, useState } from "react";

import { useCart } from "/app/dashboard/context/cartContext";
import {
    Table,
    List,
    ListItem,
    TableHead,
    TableCell,
    TableHeadCell,
    TableBody,
    TableRow,
} from "flowbite-react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function Cart({ setView }) {
    const { cart } = useCart();

    let sub = 0;
    let tax = 0;
    let total = 0;

    const getTotal = () => {
        cart.forEach((item) => {
            sub += item.price * item.quantity;
        });
        tax = sub * 0.0825;

        total = sub + tax;
    };

    getTotal();

    const round = (value) => {
        return value.toFixed(2);
    };

    async function handleCheckout() {
        const cartItems = cart.map((item) => {
            return {
                name: item.name,
                price: item.price * 100,
                quantity: item.quantity,
            };
        });

        const res = await fetch("/stripe/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cartItems }),
        });

        const { id } = await res.json();
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: id });
    }

    return (
        <div className="h-full  w-full  flex flex-col gap-4 ">
            <div className="min-h-40  flex-grow">
                <Table striped>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell className="text-nowrap">
                                Item
                            </TableHeadCell>
                            <TableHeadCell className="text-nowrap">
                                Qty
                            </TableHeadCell>
                            <TableHeadCell className="text-nowrap">
                                Unit <br /> Price
                            </TableHeadCell>
                            <TableHeadCell className="text-wrap">
                                Total <br /> Price
                            </TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="">
                        {cart.map((item, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    className="bg-white border-b border-gray-200"
                                >
                                    <TableCell className=" text-wrap text-gray-700">
                                        {item.name}
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price}</TableCell>
                                    <TableCell>
                                        ${round(item.price * item.quantity)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className="total border border-gray-300 bg-gray-100 rounded-sm p-4 mt-2 w-full ">
                <div className="font-semibold">ORDER SUMMARY</div>
                <List
                    unstyled
                    className="mt-2 p-2 divide-y divide-gray-200 dark:divide-gray-700"
                >
                    <ListItem className="pb-3 sm:pb-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse ">
                            <div className="min-w-0 flex-1">Grand Total:</div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                ${round(sub)}
                            </div>
                        </div>
                    </ListItem>
                    <ListItem className="pb-3 sm:pb-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse ">
                            <div className="min-w-0 flex-1">Estimated Tax:</div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                ${round(tax)}
                            </div>
                        </div>
                    </ListItem>
                    <ListItem className="pb-3 sm:pb-4">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse ">
                            <div className="min-w-0 flex-1">Total:</div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                ${round(total)}
                            </div>
                        </div>
                    </ListItem>
                </List>
            </div>

            <div className="flex flex-row gap-2">
                <div
                    onClick={() => setView("pos")}
                    href="/dashboard/pos"
                    className="sm:hidden px-4 w-full py-2 bg-gray-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer"
                >
                    Back
                </div>
                <div
                    onClick={() => handleCheckout()}
                    className="flex btn-secondary !text-center !w-full  justify-center"
                >
                    Checkout
                </div>
            </div>
        </div>
    );
}

export default Cart;
