"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import {
    PencilIcon,
    ChevronLeftIcon,
    SaveIcon,
} from "@heroicons/react/24/solid";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Textarea,
    Spinner,
} from "flowbite-react";

import tableTheme from "@/app/flowbite_themes/tableTheme";
import toast from "react-hot-toast";

const mockTransactions = [
    {
        id: 1,
        date: "2025-09-01",
        service: "Haircut",
        status: "Completed",
        amount: 40,
    },
    {
        id: 2,
        date: "2025-08-15",
        service: "Color",
        status: "Cancelled",
        amount: 80,
    },
];

export default function ClientDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const query = searchParams.get("edit") == "true" ? true : false;

    const { client_id } = params;

    const [editMode, setEditMode] = useState(query);
    const [client, setClient] = useState({});
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleEditToggle = async () => {
        setEditMode((prev) => !prev);
    };

    const handleInputChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const fetchClientDetails = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${client_id}`;

            axios.get(url).then((res) => {
                setClient(res.data);
                setLoading(false);
            });
        } catch (error) {
            toast.error("Oh no, something went wrong");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientDetails();
    }, []);

    useEffect(() => {
        //Only run when pressing save
        if (!editMode && mounted) {
            const updateData = async () => {
                try {
                    setLoading(true);
                    const res = await axios.put(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/clients/${client_id}`,
                        client
                    );
                    toast.success("Client updated");
                    await fetchClientDetails();
                } catch (err) {
                    toast.error("Oh no! Please try again");
                } finally {
                    setLoading(false);
                }
            };
            updateData();
        }
    }, [editMode]);

    return (
        <>
            <div className="flex justify-between items-center mb-4 sm:pr-10">
                <div className="flex items-center">
                    <ChevronLeftIcon
                        className="h-6 w-6 cursor-pointer mr-1"
                        onClick={() => router.push(`/dashboard/clients`)}
                    />
                    <h2 className="text-2xl font-bold">Client Details</h2>
                </div>
                <button
                    className="btn-primary px-2 py-1 rounded-xs"
                    onClick={handleEditToggle}
                >
                    {editMode ? "Save" : "Edit"}
                </button>
            </div>

            {/* Client Info */}
            <div className="p-2 sm:p-5 h-full   overflow-auto">
                {loading ? (
                    <div className="flex h-full  items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div className="">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                                <div>
                                    <label className="block font-semibold">
                                        First:
                                    </label>
                                    {editMode ? (
                                        <input
                                            className="border rounded px-2 py-1 w-full"
                                            name="first"
                                            value={client.first}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div>{client.first}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block font-semibold">
                                        Last:
                                    </label>
                                    {editMode ? (
                                        <input
                                            className="border rounded px-2 py-1 w-full"
                                            name="last"
                                            value={client.last}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div>{client.last}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block font-semibold">
                                        Email:
                                    </label>
                                    {editMode ? (
                                        <input
                                            className="border rounded px-2 py-1 w-full"
                                            name="email"
                                            value={client.email}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div>{client.email}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block font-semibold">
                                        Phone:
                                    </label>
                                    {editMode ? (
                                        <input
                                            className="border rounded px-2 py-1 w-full"
                                            name="phone"
                                            value={client.phone}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div>{client.phone}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Client Notes */}
                        <div className="mt-5 border-t py-5 border-gray-300">
                            <h3 className="text-xl font-semibold mb-2">
                                Client Notes
                            </h3>
                            {editMode ? (
                                <>
                                    <Textarea
                                        name="notes"
                                        rows="5"
                                        value={client?.notes}
                                        onChange={handleInputChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <pre className="bg-gray-50 p-3 rounded min-h-[60px] whitespace-pre-wrap border border-gray-200">
                                        {client?.notes != ""
                                            ? client?.notes
                                            : "Notes not found"}
                                    </pre>
                                </>
                            )}
                        </div>

                        {/* Transaction History */}
                        <div className="mt-5 border-t py-5 border-gray-300">
                            <h3 className="text-xl font-semibold mb-2">
                                Activity History
                            </h3>

                            <Table striped theme={tableTheme} className="">
                                <TableHead>
                                    <TableRow>
                                        <TableHeadCell className="pl-1">
                                            Date
                                        </TableHeadCell>
                                        <TableHeadCell className="pl-1">
                                            Services
                                        </TableHeadCell>
                                        <TableHeadCell className="pl-1">
                                            Status
                                        </TableHeadCell>

                                        <TableHeadCell className="pl-1">
                                            Amount
                                        </TableHeadCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody className="divide-y relative">
                                    {mockTransactions.map((tx, i) => {
                                        return (
                                            <TableRow
                                                key={i}
                                                className="cursor-pointer hover:bg-gray-100 "
                                            >
                                                <TableCell
                                                    key={`name_${i}`}
                                                    className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-2 "
                                                >
                                                    {tx.date}
                                                </TableCell>
                                                <TableCell
                                                    key={`phone_${i}`}
                                                    className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-1"
                                                >
                                                    {tx.service}
                                                </TableCell>

                                                <TableCell
                                                    key={`status_${i}`}
                                                    className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-1"
                                                >
                                                    {tx.status}
                                                </TableCell>

                                                <TableCell
                                                    key={`action_${i}`}
                                                    className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-1"
                                                >
                                                    {tx.amount}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
