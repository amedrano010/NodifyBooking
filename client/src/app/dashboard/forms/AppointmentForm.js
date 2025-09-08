"use client";

import { Modal, List, Toast } from "flowbite-react";
import { ConfirmModal } from "../Flowbite/ConfirmModal";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { Breadcrumb } from "flowbite-react";
import TimeSlot from "../Components/TimeSlot";
import moment from "moment";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { UserContext } from "../../context/UserContext";

export default function Component({
    openModal,
    setOpenModal,
    setRefreshAppointments,
}) {
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");

    const { user } = useContext(UserContext);
    const [newCustomer, setNewCustomer] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const [errors, setErrors] = useState({});
    const [validUser, setValidUser] = useState(false);

    const [providers, setProviders] = useState({});
    const [formData, setFormData] = useState({
        customer: "",
        first: "",
        last: "",
        phone: "",
        email: "",
        date: new Date(),
        slot: {},
    });

    useEffect(() => {
        try {
            axios
                .get("employees", { params: { store: user.selectedStore } })
                .then((res) => {
                    const employees = res.data;
                    setProviders({
                        selectedProvider: res.data[0].employee._id,
                        providers: employees,
                    });
                });
        } catch (err) {
            console.log(err);
        }
    }, [openModal]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === "") {
            setSearchResults([]);

            return;
        }

        axios
            .get(
                `${process.env.REACT_APP_BASE_URL}/customers?search=${e.target.value}`
            )
            .then((response) => {
                setSearchResults(response.data);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the clients!",
                    error
                );
            });
    };

    const handleClientSelect = (client) => {
        setFormData((prev) => ({
            ...prev,
            first: client.first,
            last: client.last,
            phone: client.phone,
            email: client.email,
            customer: client._id,
        }));

        setValidUser(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    function submitOk(e) {
        e.preventDefault(e);

        const slotStatus = formData.slot.status;
        console.log(slotStatus);
        if (slotStatus === "booked") {
            //open modal
            setConfirmModal(true);
            setConfirmMessage(
                "Your selected slot conflicts with an existing appointment. Are you sure you want to continue?"
            );
            return;
        } else if (slotStatus === "warning") {
            setConfirmModal(true);
            setConfirmMessage(
                "Your selected slot may overlap with an existing appointment. Are you sure you want to continue?"
            );
            return;
        }

        handleSubmit(e);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newCustomer) {
            try {
                const res = await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/customers`,
                    formData
                );

                if (!res.data._id) {
                    // If the request was unsuccessful, return from the function
                    console.error("Failed to add customer");
                    return;
                }

                // Optionally, update formData with the new customer ID or other details
                setFormData((prev) => ({
                    ...prev,
                    customer: res.data._id,
                }));
            } catch (err) {
                console.error("Error adding customer:", err);
                return; // Return from the function if there is an error
            }
        }

        try {
            const time = formData.slot.time.split(":");

            formData.date.setHours(0, 0, 0, 0);

            const startDate = moment(formData.date);

            startDate.set({ hour: time[0], minute: time[1] });

            const duration = selectedServices
                .filter((item) => item.selected)
                .reduce((accumulator, service) => {
                    return accumulator + service.duration;
                }, 0);

            const endDate = moment(new Date(startDate)).add(
                duration,
                "minutes"
            );

            const appointmentData = {
                provider: providers.selectedProvider,
                store: user.selectedStore,
                customer: formData.customer,
                startDate: startDate,
                endDate: endDate,
                services: selectedServices,
            };

            await axios
                .post(
                    `${process.env.REACT_APP_BASE_URL}/appointments`,
                    appointmentData
                )
                .then((response) => {
                    setRefreshAppointments((prev) => !prev);
                })
                .catch((error) => {
                    console.error(
                        "There was an error adding the appointment!",
                        error
                    );
                });
        } catch (e) {
            console.log(e);
        }

        setOpenModal(false);
        setCurrentPage(1);
        setFormData({
            customer: "",
            first: "",
            last: "",
            phone: "",
            email: "",
            date: new Date(),
            slot: {},
        });
        setSearchQuery("");
        setSearchResults([]);
    };

    const validate = () => {
        const oErrors = {};

        if (!formData.first) oErrors.first = "First name is required";
        if (!formData.last) oErrors.last = "Last name is required";
        if (!formData.email || formData.email.indexOf("@") === -1)
            oErrors.email = "Valid email is required";

        setErrors(oErrors);

        if (Object.keys(oErrors).length > 0) {
            setValidUser(false);
        } else {
            setValidUser(true);
        }
    };

    const theme = {
        root: {
            base: "",
            list: "flex items-center",
        },
        item: {
            base: "group flex items-center",
            chevron: "mx-1 h-4 w-4 text-gray-400 group-first:hidden md:mx-2",
            href: {
                off: "flex items-center text-sm font-medium text-gray-500 dark:text-gray-400",
                on: "flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
            },
            icon: "mr-2 h-4 w-4",
        },
    };

    const modalTheme = {
        root: {
            base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full ",
            show: {
                on: "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
                off: "hidden",
            },
            sizes: {
                sm: "max-w-sm",
                md: "max-w-md",
                lg: "max-w-lg",
                xl: "max-w-xl",
                "2xl": "max-w-2xl",
                "3xl": "max-w-3xl",
                "4xl": "max-w-4xl",
                "5xl": "max-w-5xl",
                "6xl": "max-w-6xl",
                "7xl": "max-w-7xl",
            },
            positions: {
                "top-left": "items-start justify-start",
                "top-center": "items-start justify-center",
                "top-right": "items-start justify-end",
                "center-left": "items-center justify-start",
                center: "items-center justify-center",
                "center-right": "items-center justify-end",
                "bottom-right": "items-end justify-end",
                "bottom-center": "items-end justify-center",
                "bottom-left": "items-end justify-start",
            },
        },
        content: {
            base: "relative w-full h-full h-screen p-4 ",
            inner: "relative flex sm:max-h-[70dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700 h-full  w-full",
        },
        body: {
            base: "flex-1 overflow-auto p-6 overflow-y-hidden",
            popup: "pt-0",
        },
        header: {
            base: "flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600",
            popup: "border-b-0 p-2",
            title: "text-xl font-medium text-gray-900 dark:text-white",
            close: {
                base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
                icon: "h-5 w-5",
            },
        },
        footer: {
            base: "flex items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600",
            popup: "border-t",
        },
    };

    const providerServices =
        providers?.providers?.filter(
            (item) => item.employee._id === providers.selectedProvider
        )[0]?.services || [];

    const selectedServices = providers?.providers
        ?.find(
            (provider) => provider.employee._id === providers.selectedProvider
        )
        .services.filter((oService) => oService.selected);

    return (
        <>
            <Modal
                theme={modalTheme}
                className=""
                show={openModal}
                size="md"
                position="center"
                popup
                onClose={() => {
                    setOpenModal(false);
                    setCurrentPage(1);
                    setNewCustomer(false);
                    setFormData({
                        customer: "",
                        first: "",
                        last: "",
                        phone: "",
                        email: "",
                        date: new Date(),
                        slot: {},
                    });
                    setProviders({});
                }}
            >
                <Modal.Header>New Appointment</Modal.Header>
                <Modal.Body>
                    <Breadcrumb theme={theme}>
                        <Breadcrumb.Item onClick={(e) => e.preventDefault()}>
                            Customer
                        </Breadcrumb.Item>
                        <Breadcrumb.Item onClick={(e) => e.preventDefault()}>
                            Services
                        </Breadcrumb.Item>
                        <Breadcrumb.Item onClick={(e) => e.preventDefault()}>
                            Appointment
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <form
                        className="py-4 flex flex-col h-full"
                        onSubmit={submitOk}
                    >
                        {currentPage === 1 && (
                            <>
                                {!newCustomer ? (
                                    <>
                                        <div className="flex flex-col flex-1">
                                            <div
                                                className="flex  items-center  gap-1 self-end bg-gray-400 w-fit py-2 px-4 rounded-sm text-white cursor-pointer shadow-md"
                                                onClick={() => {
                                                    setNewCustomer(true);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        first: "",
                                                        last: "",
                                                        phone: "",
                                                        email: "",
                                                        customer: "",
                                                    }));
                                                    setSearchQuery("");
                                                    setSearchResults([]);
                                                    setValidUser(false);
                                                    setErrors({});
                                                }}
                                            >
                                                <PlusCircleIcon className="h-5" />
                                                Customer
                                            </div>

                                            <div className=" overflow-y-hidden">
                                                <div className=" mb-3">
                                                    <label
                                                        htmlFor="searchClient"
                                                        className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Search Customer
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="searchClient"
                                                        id="searchClient"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Search by name, email, or phone number"
                                                        value={searchQuery}
                                                        onChange={
                                                            handleSearchChange
                                                        }
                                                    />
                                                </div>

                                                {searchResults.length > 0 && (
                                                    <List
                                                        unstyled
                                                        className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto"
                                                    >
                                                        {searchResults.map(
                                                            (client) => (
                                                                <List.Item
                                                                    key={
                                                                        client._id
                                                                    }
                                                                    className={`${
                                                                        client._id ===
                                                                        formData.customer
                                                                            ? "bg-gray-100 hover:bg-green-100 hover:bg-geen-100"
                                                                            : ""
                                                                    } p-3 cursor-pointer  text-sm border-t flex items-center justify-between`}
                                                                    onClick={() =>
                                                                        handleClientSelect(
                                                                            client
                                                                        )
                                                                    }
                                                                >
                                                                    <div>
                                                                        <div>
                                                                            {
                                                                                client.first
                                                                            }{" "}
                                                                            {
                                                                                client.last
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                client.phone
                                                                            }
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        {
                                                                            client.email
                                                                        }
                                                                    </div>
                                                                </List.Item>
                                                            )
                                                        )}
                                                    </List>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col flex-grow">
                                            <div
                                                className="self-end bg-gray-400 w-fit py-2 px-4 rounded-sm text-white cursor-pointer shadow-md"
                                                onClick={() => {
                                                    setNewCustomer(false);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        first: "",
                                                        last: "",
                                                        phone: "",
                                                        email: "",
                                                        customer: "",
                                                    }));
                                                    setValidUser(false);
                                                    setErrors({});
                                                }}
                                            >
                                                Search Customer
                                            </div>

                                            <div className="flex-grow mt-2">
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="first"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="first"
                                                        id="first"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Enter first name"
                                                        value={formData.first}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {errors.first && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors.first}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="last"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="last"
                                                        id="last"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Enter last name"
                                                        value={formData.last}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {errors.last && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors.last}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="email"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Enter email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {errors.email && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors.email}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="phone"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        id="phone"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="Enter phone number"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end mt-2">
                                    <div
                                        type=""
                                        className={`${
                                            formData.customer
                                                ? ``
                                                : `opacity-50 pointer-events-none`
                                        } px-4 w-1/2 py-2 bg-rose-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer`}
                                        onClick={(e) => {
                                            validate(formData);

                                            if (validUser) {
                                                setCurrentPage(2);
                                            }
                                        }}
                                    >
                                        Next
                                    </div>
                                </div>
                            </>
                        )}
                        {currentPage === 2 && (
                            <>
                                <div className="flex-grow">
                                    <div className="mt-2">
                                        <label
                                            htmlFor="serviceProvider"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Service Provider
                                        </label>
                                        <select
                                            name="serviceProvider"
                                            id="serviceProvider"
                                            value={providers.selectedProvider}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            onChange={(e) => {
                                                setProviders((prevObj) => ({
                                                    ...prevObj,
                                                    selectedProvider:
                                                        e.target.value,
                                                }));
                                            }}
                                            required
                                        >
                                            {providers.providers?.map(
                                                (obj, i) => (
                                                    <option
                                                        key={i}
                                                        value={obj.employee._id}
                                                    >
                                                        {obj.employee.first}{" "}
                                                        {obj.employee.last[0].toUpperCase()}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div className="mt-3">
                                        <label
                                            htmlFor="service"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Service Type
                                        </label>
                                        <div className="flex flex-col gap-2 overflow-y-auto">
                                            {providerServices.map((item, i) => {
                                                return (
                                                    <div
                                                        onClick={() => {
                                                            setProviders(
                                                                (prevObj) => {
                                                                    const updatedProviders =
                                                                        prevObj.providers.map(
                                                                            (
                                                                                oEmp
                                                                            ) =>
                                                                                oEmp
                                                                                    .employee
                                                                                    ._id ===
                                                                                prevObj.selectedProvider
                                                                                    ? {
                                                                                          ...oEmp,
                                                                                          services:
                                                                                              oEmp.services.map(
                                                                                                  (
                                                                                                      oService
                                                                                                  ) =>
                                                                                                      oService._id ===
                                                                                                      item._id
                                                                                                          ? {
                                                                                                                ...oService,
                                                                                                                selected:
                                                                                                                    !oService.selected,
                                                                                                            }
                                                                                                          : oService
                                                                                              ),
                                                                                      }
                                                                                    : oEmp
                                                                        );

                                                                    return {
                                                                        ...prevObj,
                                                                        providers:
                                                                            updatedProviders,
                                                                    };
                                                                }
                                                            );
                                                        }}
                                                        className={`${
                                                            item.selected
                                                                ? "bg-indigo-500 text-white"
                                                                : "bg-gray-100"
                                                        } cursor-pointer items-center flex border px-4 py-2 rounded-lg justify-between `}
                                                        key={i}
                                                    >
                                                        <div className="flex flex-col ">
                                                            <div>
                                                                {item.name}
                                                            </div>
                                                            <div className="text-sm">
                                                                ${item.price}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {item.duration} min
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-2 gap-1">
                                    <div
                                        type=""
                                        className="px-4 w-1/2 py-2 bg-gray-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(1);
                                        }}
                                    >
                                        Back
                                    </div>

                                    <div
                                        type=""
                                        className={`${
                                            selectedServices.length > 0
                                                ? ""
                                                : "opacity-50 pointer-events-none"
                                        } px-4 w-1/2 py-2 bg-rose-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer`}
                                        onClick={(e) => {
                                            setCurrentPage(3);
                                        }}
                                    >
                                        Next
                                    </div>
                                </div>
                            </>
                        )}

                        {currentPage === 3 && (
                            <>
                                <div className="flex-grow flex flex-col overflow-y-hidden px-2 h-full">
                                    <TimeSlot
                                        state={formData}
                                        setState={setFormData}
                                        services={selectedServices}
                                    />
                                </div>

                                <div className="flex justify-end mt-2 gap-1 ">
                                    <div
                                        type=""
                                        className="px-4 w-1/2 py-2 bg-gray-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(2);
                                        }}
                                    >
                                        Back
                                    </div>

                                    <button
                                        className={`${
                                            formData.slot.time
                                                ? ""
                                                : "opacity-50 pointer-events-none"
                                        } px-4 w-1/2 py-2 bg-rose-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer`}
                                    >
                                        Submit
                                    </button>
                                </div>

                                <ConfirmModal
                                    openModal={confirmModal}
                                    setOpenModal={setConfirmModal}
                                    message={confirmMessage}
                                    handleConfirm={handleSubmit}
                                />
                            </>
                        )}
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}
