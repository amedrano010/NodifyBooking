"use client";

import React, { useEffect, useState } from "react";
import {
    Avatar,
    Label,
    TextInput,
    List,
    ListItem,
    Toast,
} from "flowbite-react";
import TimeSlot from "/components/ui/Timeslot";
import Link from "next/link";
import axios from "axios";
import { CalendarIcon } from "@heroicons/react/24/solid";
import avatarTheme from "./themeAvatar";
import { useParams } from "next/navigation";

function Appointment() {
    const params = useParams();
    const { company } = params;

    const [storeInfo, setStoreInfo] = useState(null);
    const [page, setPage] = useState(1);
    const [companyInfo, setCompanyInfo] = useState({});
    const [stores, setStores] = useState({});
    const [providers, setProviders] = useState([]);
    const [services, setServices] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [errors, setErrors] = useState({});

    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        date: new Date(),
        first: "",
        last: "",
        email: "",
        phone: "",
        provider: {},
        store: {},
        services: [],
        slot: {},
    });

    const fetchStores = () => {
        try {
            axios
                .get(`${process.env.NEXT_PUBLIC_BASE_URL}/stores`, {
                    params: { company: company },
                })
                .then((res) => {
                    const stores = res.data;
                    setStores(stores);
                    setCompanyInfo(stores[0].company);
                });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchEmployees = () => {
        if (page == 2 && formData.store._id) {
            try {
                axios
                    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/employees`, {
                        params: { store: formData.store._id },
                    })
                    .then((res) => {
                        const employees = res.data;

                        setProviders(employees);
                    });
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, [page]);

    const validate = () => {
        const oErrors = {};
        if (formData.first === "") {
            oErrors.first = `Please provide a first name`;
        }
        if (formData.last === "") {
            oErrors.last = `Please provide a last name`;
        }

        if (formData.email === "") {
            oErrors.email = `Please provide an email`;
        }

        if (formData.phone === "") {
            oErrors.phone = `Please provide a phone`;
        }

        if (!selectedProvider) {
            oErrors.provider = "Please selected a provider";
        }

        if (selectedServices.length === 0) {
            oErrors.services = "Please selected 1 or more services";
        }

        setErrors(oErrors);
    };

    useEffect(() => {
        return;
        //get compnay from store
        axios
            .get("/stores", {
                params: {
                    store: store,
                },
            })
            .then((res) => {
                setStoreInfo(res.data);
            });
    }, []);

    //get providers
    useEffect(() => {
        return;
        //get employees
        axios
            .get("/employees", {
                params: {
                    store: store,
                },
            })
            .then((res) => {
                const employees = res.data;
                let staff = employees.map((emp) => {
                    return {
                        ...emp,
                        ...emp.employee,
                    };
                });

                //setProviders(staff);
            });
    }, [refresh]);

    const handleSetForm = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    function messageToast(message) {
        setToast(message);
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }

    const handleSubmit = async () => {
        validate();

        return;
        if (Object.key(errors).length == 0) {
            const oData = {
                ...formData,
                store: store,
                provider: providers.find((prov) => prov.selected).employee._id,
                services: services
                    .filter((serv) => serv.selected)
                    .map((serv) => serv._id),
            };

            if (!errors) {
                let customerId;
                const resCustomer = await axios.get(
                    `/customers/${oData.email}`
                ); //check if customer exist by email
                customerId = resCustomer.data._id;
                if (!customerId) {
                    //create new customer
                    const newCustomer = await axios.post("/customers", {
                        email: oData.email,
                        first: oData.first,
                        last: oData.last,
                        phone: oData.phone,
                    });

                    customerId = newCustomer.data._id;
                }

                oData.customer = customerId;

                const resAppointment = await axios.post(
                    "/appointments/new",
                    oData
                );

                if (resAppointment.data.appointment) {
                    setFormData({
                        //date: new Date(),
                        slot: {},
                        first: "",
                        last: "",
                        phone: "",
                        email: "",
                    });
                    setRefresh((prev) => !prev);
                    messageToast("Appointment created successfully");
                    setPage(1);
                } else {
                    messageToast(
                        "Oh no! Something went wrong. Please try again."
                    );
                }
            }
        }
    };

    return (
        <div className="relative h-screen w-full flex flex-col">
            <div className="w-full  flex flex-col !overflow-y-hidden mb-18">
                <Toast
                    className={`absolute bottom-5 left-5  ${
                        toast ? "flex" : "hidden"
                    }`}
                >
                    <CalendarIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
                    <div className="pl-4 text-sm font-normal">{toast}</div>
                </Toast>
                <div className="flex flex-col justify-center items-center  gap-4 bg-indigo-500 w-full  text-white  min-h-30 h-30 max-h-30">
                    <div className="text-3xl">
                        {companyInfo?.name
                            ? companyInfo.name
                            : "Nodify Booking"}
                    </div>
                    <div className="text-sm">
                        {storeInfo?.address
                            ? storeInfo?.address
                            : "Your spot is just a click away — powered by Loop."}
                    </div>
                </div>

                <div className="flex  flex-col  flex-grow items-center  p-4 overflow-y-auto">
                    {page === 1 && (
                        <div className="flex  overflow-y-hidden w-full flex-col px-2">
                            <div className="">Select a store location: </div>

                            <div className=" flex-grow  overflow-y-auto grid grid-cols-1 gap-2  py-4">
                                {stores.length > 0 ? (
                                    stores.map((store, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    store: prev.store._id
                                                        ? {}
                                                        : store,
                                                }));
                                            }}
                                            className={` ${
                                                store._id == formData.store._id
                                                    ? "border-2 border-rose-200"
                                                    : ""
                                            } flex   items-center border border-gray-200 rounded-lg py-2 px-4 gap-5 h-28 cursor-pointer`}
                                        >
                                            <div className="">
                                                <div>{store?._id} </div>
                                                <div>{store?.name} </div>
                                                <div>Address</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        Oops! looks like we dont have any
                                        stores. Please try again later
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {page === 2 && (
                        <div className="flex   overflow-y-hidden w-full flex-col px-2">
                            <div className="">Select provider: </div>

                            <div className=" flex-grow  overflow-y-auto grid grid-cols-1 gap-2  py-4">
                                {providers.length > 0 ? (
                                    providers.map((provider, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setFormData((prev) => {
                                                    const prov = prev.provider
                                                        ._id
                                                        ? {}
                                                        : provider;

                                                    setServices(
                                                        (prevServices) => {
                                                            return prov._id
                                                                ? prov.services
                                                                : [];
                                                        }
                                                    );

                                                    return {
                                                        ...prev,
                                                        provider: prov,
                                                    };
                                                });
                                            }}
                                            className={` ${
                                                provider._id ==
                                                formData.provider._id
                                                    ? "border-2 border-rose-200"
                                                    : ""
                                            } flex   items-center border border-gray-200 rounded-lg py-2 px-4 gap-5 h-28 cursor-pointer`}
                                        >
                                            <Avatar
                                                theme={avatarTheme}
                                                rounded={true}
                                                size={"lg"}
                                                img={provider.profile}
                                            />
                                            <div className="">
                                                <div>
                                                    {provider?.employee?.first}{" "}
                                                    {provider.employee?.last &&
                                                        provider?.employee
                                                            ?.last[0]}
                                                    {"."}
                                                </div>

                                                <div className="text-xs">
                                                    position
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        Oops! looks like we dont have any
                                        available employees. Please try again
                                        later
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {page === 3 && (
                        <div className="flex overflow-y-hidden w-full  flex-col px-2">
                            <div className="mb-2">Select services:</div>
                            <div className="grid grid-cols-2 overflow-y-auto gap-2  py-2">
                                {services.map((service, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                services: prev.services.some(
                                                    (s) => s._id === service._id
                                                )
                                                    ? prev.services.filter(
                                                          (s) =>
                                                              s._id !==
                                                              service._id
                                                      ) // remove
                                                    : [
                                                          ...prev.services,
                                                          service,
                                                      ], // add
                                            }));
                                        }}
                                        className={` ${
                                            formData.services.some(
                                                (obj) => obj._id == service._id
                                            )
                                                ? "border-2 border-rose-200 "
                                                : ""
                                        } border border-gray-200 rounded-md py-2 px-4 cursor-pointer`}
                                    >
                                        <div>{service.name}</div>
                                        <div className="text-sm">
                                            <span className="text-xs">
                                                {service.prefix
                                                    ? service.prefix
                                                    : "From"}{" "}
                                            </span>
                                            ${service.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {page === 4 && (
                        <div className="flex overflow-y-hidden w-full  flex-col ">
                            <div className="mb-2">Pick your happy place:</div>

                            <TimeSlot
                                formData={formData}
                                setFormData={setFormData}
                                store={formData.store._id}
                            />
                        </div>
                    )}

                    {page === 5 && (
                        <div className=" flex w-full flex-col space-y-4 p-3 overflow-y-auto ">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-start w-full ">
                                    <Label className="block text-sm font-medium text-gray-700">
                                        First Name:
                                    </Label>
                                    <TextInput
                                        className="mt-1 block w-full  rounded-lg  focus:ring-indigo-500 focus:border-indigo-500"
                                        id="first"
                                        name="first"
                                        value={formData.first}
                                        onChange={handleSetForm}
                                    />
                                    {errors.first && (
                                        <p className="text-sm text-red-600">
                                            {errors.first}
                                        </p>
                                    )}
                                </div>
                                <div className="text-start w-full">
                                    <Label className="block text-sm font-medium text-gray-700">
                                        Last Name:{" "}
                                    </Label>
                                    <TextInput
                                        className="mt-1 block w-full  rounded-lg  focus:ring-indigo-500 focus:border-indigo-500"
                                        name="last"
                                        value={formData.last}
                                        onChange={handleSetForm}
                                    />
                                    {errors.last && (
                                        <p className="text-sm text-red-600">
                                            {errors.last}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="text-start w-full">
                                <Label className="block text-sm font-medium text-gray-700">
                                    Email:{" "}
                                </Label>
                                <TextInput
                                    className="mt-1 block w-full  rounded-lg  focus:ring-indigo-500 focus:border-indigo-500"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleSetForm}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="text-start w-full">
                                <Label className="block text-sm font-medium text-gray-700">
                                    Phone:{" "}
                                </Label>
                                <TextInput
                                    className="mt-1 block w-full  rounded-lg  focus:ring-indigo-500 focus:border-indigo-500"
                                    name="phone"
                                    type="phone"
                                    value={formData.phone}
                                    onChange={handleSetForm}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-600">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 border rounded-md border-gray-200 bg-gray-100 p-4">
                                <div className="flex  justify-between w-full items-center">
                                    <Label className="block text-sm font-medium text-gray-700">
                                        Service provider:{" "}
                                    </Label>
                                    <div>
                                        {formData.provider.employee?.first}{" "}
                                        {formData.provider.employee?.last[0]}
                                        {"."}
                                    </div>
                                </div>
                                <div className="flex justify-between  w-full items-center">
                                    <Label className="block text-sm font-medium text-gray-700">
                                        Date:{" "}
                                    </Label>
                                    <div>
                                        {formData.date.toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex justify-between  w-full items-center">
                                    <Label className="block text-sm font-medium text-gray-700">
                                        Time:{" "}
                                    </Label>
                                    <div>{formData.slot._id}</div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <Label className="block text-sm font-medium text-gray-700">
                                        Services:{" "}
                                    </Label>
                                    <List
                                        unstyled
                                        className="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
                                    >
                                        {formData.services.map((service, i) => {
                                            return (
                                                <ListItem
                                                    key={i}
                                                    className="py-2 text-sm"
                                                >
                                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                        <div className="text-gray-900 min-w-0 flex-1">
                                                            {service.name}
                                                        </div>
                                                        <div className="inline-flex items-center  font-semibold text-gray-900 dark:text-white">
                                                            {service.prefix
                                                                ? service.prefix
                                                                : "From"}
                                                            {" $"}
                                                            {service.price}
                                                        </div>
                                                    </div>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 w-full bg-white">
                {/* Progress indicator */}
                <div className="flex justify-center items-center space-x-2 h-8">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={`h-1 w-8 rounded-full ${
                                page >= step ? "bg-blue-400" : "bg-gray-200"
                            }`}
                        />
                    ))}
                </div>
                <div className="flex w-full gap-2  bg-white p-3">
                    <div
                        className={`${
                            page == 1 ? "hidden" : ""
                        } py-2 px-4 bg-neutral-400 text-white rounded-sm cursor-pointer w-1/2 items-center flex justify-center`}
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        Back
                    </div>
                    <div
                        className={`${
                            page == 5 ? "hidden" : ""
                        } btn-secondary w-1/2 ml-auto text-center items-center flex justify-center`}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Next
                    </div>
                    <div
                        className={`${
                            page != 5 ? "hidden" : ""
                        } btn-secondary flex items-center justify-center text-white py-2 px-4  rounded-sm cursor-pointer w-1/2`}
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        Book
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Appointment;
