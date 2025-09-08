"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Label, TextInput, List, Toast } from "flowbite-react";
import TimeSlot from "@/components/ui/TimeSlot";
import Link from "next/link";
import axios from "axios";
import { CalendarIcon } from "@heroicons/react/24/solid";
import avatarTheme from "./themeAvatar";
import { useParams } from "next/navigation";

function Appointment({ params }) {
    const { store } = useParams();
    const [storeInfo, setStoreInfo] = useState(null);
    const [page, setPage] = useState(1);
    const [providers, setProviders] = useState([{ first: "Abram" }]);
    const [services, setServices] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [errors, setErrors] = useState({});

    const [toast, setToast] = useState(null);

    const selectedProvider = providers.find((prov) => prov.selected);
    const selectedServices = services.filter((item) => item.selected);

    const [formData, setFormData] = useState({
        date: new Date(),
        slot: {},
        first: "",
        last: "",
        phone: "",
        email: "",
    });

    console.log(formData);

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
                        date: new Date(),
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

    console.log(providers);

    return (
        <>
            <div className="w-full h-screen flex flex-col overflow-hidden">
                <Toast
                    className={`absolute bottom-5 left-5  ${
                        toast ? "flex" : "hidden"
                    }`}
                >
                    <CalendarIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
                    <div className="pl-4 text-sm font-normal">{toast}</div>
                </Toast>
                <div className="flex flex-col justify-center items-center  gap-2 bg-indigo-500 w-full  text-white py-6 min-h-30 h-30 max-h-30">
                    <div className="text-3xl">
                        {storeInfo?.company?.name
                            ? storeInfo?.company?.name
                            : "Nodify Booking"}
                    </div>
                    <div>
                        {storeInfo?.address
                            ? storeInfo?.address
                            : "Appointments made easy"}
                    </div>
                </div>

                <div className="flex flex-col border flex-grow items-center gap-3 p-5 overflow-hidden">
                    {page === 1 && (
                        <div className="flex  h-full overflow-y-hidden w-full flex-col px-2">
                            <div className="">Select provider: </div>

                            <div className=" flex-grow  overflow-y-auto grid grid-cols-1 gap-2  py-4">
                                {providers.length > 0 ? (
                                    providers.map((provider, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setProviders((prev) => {
                                                    return prev.map((item) => {
                                                        if (
                                                            item._id ===
                                                            provider._id
                                                        ) {
                                                            item.selected =
                                                                !item.selected;
                                                        } else {
                                                            item.selected = false;
                                                        }

                                                        if (item.selected) {
                                                            setServices(
                                                                item.services
                                                            );
                                                        }

                                                        return item;
                                                    });
                                                });
                                            }}
                                            className={` ${
                                                provider.selected
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
                                                    {provider?.first}{" "}
                                                    {provider.last &&
                                                        provider?.last[0]}
                                                    {"."}
                                                </div>

                                                <Link
                                                    href={"/"}
                                                    className="text-xs"
                                                >
                                                    instagram
                                                </Link>
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

                            <div className="flex justify-end text-white   mt-2 ">
                                <div
                                    className={` py-2 px-4 bg-rose-400 rounded-md cursor-pointer ${
                                        selectedProvider
                                            ? "opacity-100"
                                            : " opacity-50"
                                    } `}
                                    onClick={() => setPage(2)}
                                >
                                    Next
                                </div>
                            </div>
                        </div>
                    )}

                    {page === 2 && (
                        <div className="flex overflow-y-hidden w-full h-full  flex-col px-2">
                            <div className="mb-2">Select services:</div>
                            <div className="flex-grow flex flex-col overflow-y-auto gap-2  py-2">
                                {services.map((service, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setServices((prev) => {
                                                return prev.map((prevService) =>
                                                    prevService._id ===
                                                    service._id
                                                        ? {
                                                              ...prevService,
                                                              selected:
                                                                  !prevService.selected,
                                                          }
                                                        : prevService
                                                );
                                            });
                                        }}
                                        className={` ${
                                            service.selected
                                                ? "border-2 border-rose-200 "
                                                : ""
                                        } flex justify-between h-14 items-center border rounded-lg py-2 px-4 cursor-pointer`}
                                    >
                                        <div>{service.name}</div>
                                        <div>
                                            <span className="text-xs">
                                                {service.priceType
                                                    ? service.priceType
                                                    : "From"}{" "}
                                            </span>
                                            ${service.price}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between text-white mt-4 ">
                                <div
                                    className=" py-2 px-4 bg-gray-400 rounded-md cursor-pointer"
                                    onClick={() => setPage(1)}
                                >
                                    Back
                                </div>
                                <div
                                    className={` py-2 px-4 bg-rose-400 rounded-md cursor-pointer  ${
                                        selectedServices.length > 0
                                            ? "opacity-100"
                                            : "opacity-50"
                                    }`}
                                    onClick={() => setPage(3)}
                                >
                                    Next
                                </div>
                            </div>
                        </div>
                    )}

                    {page === 3 && (
                        <div className="flex overflow-y-hidden w-full h-full  flex-col ">
                            <div className=" px-4">Select time slot:</div>
                            <div className="flex-grow  overflow-y-hidden grid grid-cols-1 gap-2 mt-4 px-4">
                                <TimeSlot
                                    state={formData}
                                    setState={setFormData}
                                    services={selectedServices}
                                    store={store}
                                />
                            </div>

                            <div className="flex justify-between text-white  ">
                                <div
                                    className=" py-2 px-4 bg-gray-400 rounded-md cursor-pointer"
                                    onClick={() => setPage(2)}
                                >
                                    Back
                                </div>
                                <div
                                    className={` py-2 px-4 bg-rose-400 rounded-md cursor-pointer ${
                                        formData.slot.id
                                            ? "opacity-100"
                                            : "opacity-50"
                                    }`}
                                    onClick={() => setPage(4)}
                                >
                                    Next
                                </div>
                            </div>
                        </div>
                    )}

                    {page === 4 && (
                        <div className="flex overflow-y-hidden w-full h-full  flex-col px-2">
                            <div className="mb-4">Your Info:</div>
                            <div className="flex-grow flex flex-col gap-10">
                                <div className=" flex flex-col  items-center overflow-y-auto gap-5 px-6 ">
                                    <div className="text-start w-full">
                                        <Label>First:</Label>
                                        <TextInput
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
                                        <Label>Last: </Label>
                                        <TextInput
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
                                    <div className="text-start w-full">
                                        <Label>Email: </Label>
                                        <TextInput
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
                                        <Label>Phone: </Label>
                                        <TextInput
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
                                    <div className="w-full flex flex-col overflow-y-auto gap-5  ">
                                        <div className="flex justify-between">
                                            <Label>Service provider: </Label>
                                            <div>
                                                {selectedProvider?.first}{" "}
                                                {selectedProvider?.last[0]}
                                                {"."}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <Label>Date: </Label>
                                            <div>3/15/2025</div>
                                        </div>
                                        <div className="flex justify-between">
                                            <Label>Time: </Label>
                                            <div>3:00 PM</div>
                                        </div>
                                        <div className="flex flex-col justify-between">
                                            <Label>Services: </Label>
                                            <List
                                                unstyled
                                                className="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
                                            >
                                                {selectedServices.map(
                                                    (service, i) => {
                                                        return (
                                                            <List.Item
                                                                key={i}
                                                                className="py-2 text-sm"
                                                            >
                                                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                                    <div className="text-gray-900 min-w-0 flex-1">
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </div>
                                                                    <div className="inline-flex items-center  font-semibold text-gray-900 dark:text-white">
                                                                        from $
                                                                        {
                                                                            service.price
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </List.Item>
                                                        );
                                                    }
                                                )}
                                            </List>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-white mt-4 ">
                                <div
                                    className=" py-2 px-4 bg-gray-400 rounded-md cursor-pointer"
                                    onClick={() => setPage(3)}
                                >
                                    Back
                                </div>
                                <div
                                    className=" py-2 px-4 bg-rose-400 rounded-md cursor-pointer"
                                    onClick={() => {
                                        handleSubmit();
                                    }}
                                >
                                    Confirm
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Appointment;
