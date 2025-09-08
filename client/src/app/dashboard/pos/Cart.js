import React, { useContext, useState } from "react";

import { useCart } from "../../context/cartContext";
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

    return (
        <div className="h-full w-full py-2 flex flex-col gap-4 ">
            <div className="min-h-40 overflow-x-auto flex-grow">
                <Table striped>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>Item</TableHeadCell>
                            <TableHeadCell>Qty</TableHeadCell>
                            <TableHeadCell>Unit Price</TableHeadCell>
                            <TableHeadCell>Total Price</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y">
                        {cart.map((item, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <TableCell className="whitespace-nowrap font-medium text-gray-700 dark:text-white">
                                        {item.name}
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price}</TableCell>
                                    <TableCell>${item.price}</TableCell>
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
                <Link
                    href="dashboard/pos/checkout"
                    className="px-4 w-full py-2 bg-rose-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer"
                >
                    Checkout
                </Link>
            </div>
        </div>
    );
}

export default Cart;
