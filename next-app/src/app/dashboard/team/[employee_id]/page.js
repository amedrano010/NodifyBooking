"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams, useSearchParams } from "next/navigation";

import {
    PencilIcon,
    ChevronLeftIcon,
    SaveIcon,
    PhotoIcon,
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
import { useUser } from "../../context/userContext";

import PosItemCard from "../../pos/components/ui/posItem";

import tableTheme from "/app/flowbite_themes/tableTheme";
import toast from "react-hot-toast";

import Image from "next/image";

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
const services = [
    {
        _id: "1",
        name: "Haircut",
        duration: "45",
    },
    {
        _id: "2",
        name: "Beard trim",
        duration: "30",
        selected: true,
    },
    {
        _id: "3",
        name: "Hair trim",
        duration: "20",
    },
];

export default function EmployeeDetailsPage() {
    const { user } = useUser();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const query = searchParams.get("edit") == "false" ? false : false;

    const { employee_id } = params;

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [saveSubmit, setSaveSubmit] = useState(false);

    const handleInputChange = (e) => {
        setData({ ...employee, [e.target.name]: e.target.value });
    };

    const fetchCompanyServices = async () => {
        let companyServices = [];
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/services`;

            let res = await axios.get(url, {
                params: {
                    company: user.selectedStore.companyId,
                },
            });

            companyServices = res.data.map((item) => item.service);
        } catch (error) {
            toast.error("Oh no, something went wrong");
            setLoading(false);
        }

        return companyServices;
    };

    const fetchEmployeeDetails = async () => {
        try {
            let companyServices = await fetchCompanyServices();

            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/employees`;

            axios
                .get(url, {
                    params: {
                        employee: employee_id,
                        store: user.selectedStore._id,
                    },
                })
                .then((res) => {
                    const assignedServices = res.data[0].services;

                    companyServices = companyServices.map((service) => {
                        let match = assignedServices.find(
                            (item) => item._id == service._id
                        );

                        return match ? { ...match, selected: true } : service;
                    });

                    setData({ ...res.data[0], services: companyServices });
                    setLoading(false);
                });
        } catch (error) {
            toast.error("Oh no, something went wrong");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeDetails();
    }, []);

    const saveEmployeeDetails = async () => {
        try {
            axios
                .post(`${process.env.NEXT_PUBLIC_BASE_URL}/employees`, {
                    user: employee_id,
                    services: data.services.filter(
                        (service) => service.selected
                    ),
                    store: user.selectedStore._id,
                })
                .then(() => {
                    toast.success("Saved!");
                    console.log("saved");
                });
        } catch (error) {
            toast.error("Oh no! Please try again");
        }
    };

    function handleSelectService(id) {
        setData((prev) => {
            const services = prev.services.map((service) => {
                return service._id == id
                    ? {
                          ...service,
                          selected: !service.selected,
                      }
                    : service;
            });

            const newData = { ...prev, services };

            return newData;
        });
        setSaveSubmit((prev) => !prev);
    }

    useEffect(() => {
        if (!data._id) return;
        const delayDebounce = setTimeout(() => {
            saveEmployeeDetails();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [saveSubmit]);

    return (
        <div className="card">
            <div className="flex border-b pb-2 border-gray-200 justify-between items-center mb-2 sm:pr-10">
                <div
                    onClick={() => router.push(`/dashboard/team`)}
                    className="btn-neutral "
                >
                    <ChevronLeftIcon className="h-5" />
                    <h2 className="">Back</h2>
                </div>
            </div>

            {/* employee Info */}
            <div className="p-2 sm:p-5 h-full   overflow-auto">
                {loading ? (
                    <div className="flex h-full  items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div className="">
                            <h3 className="text-xl font-semibold mb-2">
                                Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                                <div>
                                    <label className="block font-semibold">
                                        First:
                                    </label>

                                    <div>{data?.employee?.first}</div>
                                </div>
                                <div>
                                    <label className="block font-semibold">
                                        Last:
                                    </label>

                                    <div>{data?.employee?.last}</div>
                                </div>
                                <div>
                                    <label className="block font-semibold">
                                        Email:
                                    </label>

                                    <div>{data?.employee?.email}</div>
                                </div>
                                <div>
                                    <label className="block font-semibold">
                                        Phone:
                                    </label>

                                    <div>{data?.employee?.phone}</div>
                                </div>
                                <div>
                                    <label className="block font-semibold">
                                        Role:
                                    </label>

                                    <div>{data?.role}</div>
                                </div>
                            </div>
                        </div>

                        {/* employee services */}
                        <div className="mt-5 border-t py-5 border-gray-200">
                            <h3 className="text-xl font-semibold mb-2">
                                Services
                            </h3>
                            <div className="flex flex-wrap gap-2 max-h-screen overflow-y-auto">
                                {data &&
                                    data?.services?.map((item, i) => {
                                        return (
                                            <article
                                                key={i}
                                                className={`${
                                                    item.selected
                                                        ? "border-indigo-500 border-2"
                                                        : "border-slate-300 "
                                                } w-40 max-w-xs bg-white border rounded-md shadow-sm p-3 flex flex-col gap-3 transition-transform `}
                                                aria-labelledby={`item-${item.id}-name`}
                                                onClick={() =>
                                                    handleSelectService(
                                                        item._id
                                                    )
                                                }
                                            >
                                                <div className="hidden relative overflow-hidden border border-slate-300 rounded-lg">
                                                    <div className="aspect-[4/3] w-full rounded-md overflow-hidden bg-slate-50  ">
                                                        <Image
                                                            width={300}
                                                            height={300}
                                                            src={item.images[0]}
                                                            alt={item.name}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h3
                                                            id={`item-${item.id}-name`}
                                                            className="text-sm font-semibold text-slate-900 truncate"
                                                        >
                                                            {item.name}
                                                        </h3>
                                                        <p className="hidden mt-1 text-xs text-slate-500 ">
                                                            SKU:{" "}
                                                            {item.description}{" "}
                                                            test
                                                        </p>
                                                    </div>

                                                    <div className="flex font-medium text-sm items-center gap-1">
                                                        <p className=" text-slate-900 ">
                                                            {item.duration}
                                                        </p>
                                                        <label>Min</label>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="mt-5 border-t py-5 border-gray-300 hidden">
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
        </div>
    );
}
