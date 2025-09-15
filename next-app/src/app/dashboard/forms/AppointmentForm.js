"use client";

import { List, ListItem, Toast, Label, TextInput } from "flowbite-react";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { Breadcrumb, Spinner } from "flowbite-react";
import TimeSlot from "/components/ui/TimeSlot";
import moment from "moment";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { UserContext } from "/app/dashboard/context/userContext";
import toast from "react-hot-toast";
import { useAppointments } from "../context/appointmentContext";
import Modal from "/components/Modal";

export default function Component({ open, setOpen }) {
    const today = moment().startOf("day");

    const { user } = useContext(UserContext);
    const { setRefreshAppointments } = useAppointments();

    const [loadingClients, setLoadingClients] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        client: {},
        date: today.toDate(),
        slot: {},
        provider: {},
        services: [],
    });

    //First page
    const [searchClient, setSearchClient] = useState("");
    const [clients, setClients] = useState([]);

    //Second page
    const [providers, setProviders] = useState([]);

    const [errors, setErrors] = useState({});
    const [validUser, setValidUser] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (currentPage == 2) {
            try {
                axios
                    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/employees`, {
                        params: { store: user.selectedStore._id },
                    })
                    .then((res) => {
                        const employees = res.data;

                        setFormData((prev) => {
                            return {
                                ...prev,
                                provider: employees[0].employee,
                            };
                        });

                        setProviders(employees);
                    });
            } catch (err) {
                console.log(err);
            }
        }
    }, [currentPage]);

    //Only fetch clients for this store
    const fetchClients = async () => {
        setLoadingClients(true);
        await axios
            .get(`${process.env.NEXT_PUBLIC_BASE_URL}/clients`, {
                params: {
                    search: searchClient,
                    company: user.selectedStore.companyId,
                },
            })
            .then((response) => {
                setClients(
                    response?.data?.map((item) => ({
                        ...item,
                        name: `${item.first} ${item.last}.`,
                    }))
                );
                setLoadingClients(false);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the customers!",
                    error
                );
            });
    };

    useEffect(() => {
        if (open) {
            const delayDebounce = setTimeout(() => {
                fetchClients().then(() => {});
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [open, searchClient]);

    const handleClientSelect = (client) => {
        setFormData((prev) => ({
            ...prev,
            client,
        }));

        setValidUser(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(e);

        const slotStatus = formData.slot.status;
        /*
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

        */
        try {
            const duration = formData.services.reduce(
                (accumulator, service) => {
                    return accumulator + service.duration;
                },
                0
            );

            const endDate = moment(formData.startDate).add(duration, "minutes");

            const appointmentData = {
                provider: formData.provider._id,
                store: user.selectedStore._id,
                client: formData.client._id,
                startDate: formData.startDate.toDate(),
                endDate: endDate.toDate(),
                services: formData.services,
                createdBy: user._id,
            };

            await axios
                .post(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/appointments`,
                    appointmentData
                )
                .then((response) => {
                    setRefreshAppointments((prev) => !prev);
                    toast.success("Appointment created!");
                })
                .catch((error) => {
                    toast.success("Oh no! Please try again.");
                    console.error(
                        "There was an error adding the appointment!",
                        error
                    );
                });
        } catch (e) {
            console.log(e);
        }

        setOpen(false);
        setCurrentPage(1);
        setFormData({
            client: {},
            provider: {},
            services: [],
            date: today.toDate(),
            slot: {},
        });
        setSearchClient("");
    };

    const handleProviderChange = (providerId) => {
        setFormData((prev) => {
            const selectedProvider = prev.providers.find(
                (provider) => provider._id == providerId
            );

            return {
                ...prevForm,
                provider: selectedProvider,
            };
        });
    };

    const handleServiceChange = (item) => {
        //Updates form display

        setFormData((prev) => {
            const alreadySelected = prev.services.some(
                (s) => s._id === item._id
            );

            return {
                ...prev,
                services: alreadySelected
                    ? prev.services.filter((s) => s._id !== item._id) // remove if already selected
                    : [...prev.services, item], // add if not
            };
        });
    };

    const validate = () => {
        const oErrors = {};

        if (currentPage == 1) {
            if (Object.keys(formData.client).length === 0)
                oErrors.client = "*Must select a client";
        }

        if (currentPage == 2) {
            if (Object.keys(formData.provider).length === 0)
                oErrors.provider = "*Must select a provider";
            if (formData.services.length == 0)
                oErrors.services = "*Must select one or more services";
        }
        if (currentPage == 3) {
            if (!formData.date || Object.keys(formData.slot).length === 0)
                oErrors.date = "*Must select a date & time";
        }

        setErrors(oErrors);

        return Object.keys(oErrors).length === 0;
    };

    const providerServices =
        providers?.filter(
            (item) => item.employee._id === formData.provider._id
        )[0]?.services || [];

    const selectedTotals = {
        length: formData.services?.length,
        duration: formData.services.reduce(
            (acc, item) => acc + (item.duration || 0),
            0 // initial value
        ),
        price: formData.services.reduce(
            (acc, item) => acc + (item.price || 0),
            0 // initial value
        ),
    };

    return (
        <>
            <Modal
                open={open}
                setOpen={() => setOpen(false)}
                title={"New Appointment"}
            >
                <form
                    className=" flex flex-col w-full min-h-96 sm:max-h-[700px] h-full"
                    onSubmit={handleSubmit}
                >
                    {currentPage === 1 && (
                        <>
                            <div className="flex flex-col flex-grow mt-2 h-full">
                                <div className=" overflow-y-hidden flex flex-col ">
                                    <div className=" mb-3">
                                        <label
                                            htmlFor="searchClient"
                                            className="mb-4 font-semibold  "
                                        >
                                            Search Client
                                        </label>
                                        {errors.client && (
                                            <span className="ml-2 text-sm text-red-600">
                                                {errors.client}
                                            </span>
                                        )}

                                        <input
                                            type="text"
                                            name="searchClient"
                                            id="searchClient"
                                            className="bg-gray-50 border mt-2 border-gray-300 w-full h-10"
                                            placeholder="Search by name, email, or phone number"
                                            value={searchClient}
                                            onChange={(e) =>
                                                setSearchClient(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                    e.preventDefault();
                                            }}
                                        />
                                    </div>
                                    {loadingClients && (
                                        <div className="flex items-center justify-center h-20">
                                            <Spinner />
                                        </div>
                                    )}

                                    {!loadingClients && clients.length > 0 && (
                                        <List
                                            unstyled
                                            className="max-w-md divide-y divide-gray-200 overflow-y-auto"
                                        >
                                            {clients.map((item) => (
                                                <ListItem
                                                    key={item._id}
                                                    className={`${
                                                        item._id ===
                                                        formData.client._id
                                                            ? "bg-gray-100 hover:bg-green-100 hover:bg-geen-100 !border-t-0"
                                                            : ""
                                                    } p-3 cursor-pointer  text-sm  flex items-center justify-between`}
                                                    onClick={() =>
                                                        handleClientSelect(item)
                                                    }
                                                >
                                                    <div>
                                                        <div>
                                                            {item.first}{" "}
                                                            {item.last}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {item.email}
                                                        <div>{item.phone}</div>
                                                    </div>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}

                                    {!loadingClients && clients.length == 0 && (
                                        <div className="flex items-center justify-center h-20">
                                            No clients found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {currentPage === 2 && (
                        <>
                            <div className=" flex flex-col h-full flex-grow  pb-1">
                                <div className="mt-2 ">
                                    <label
                                        htmlFor="serviceProvider"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Service Provider
                                    </label>
                                    {errors.provider && (
                                        <span className="ml-2 text-sm text-red-600">
                                            {errors.provider}
                                        </span>
                                    )}

                                    <select
                                        name="serviceProvider"
                                        id="serviceProvider"
                                        value={formData.provider._id}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        onChange={(e) => {
                                            handleProviderChange(
                                                e.target.value
                                            );
                                        }}
                                        required
                                    >
                                        {providers?.map((obj, i) => (
                                            <option
                                                key={i}
                                                value={obj.employee._id}
                                            >
                                                {obj.employee.first}{" "}
                                                {obj.employee.last[0].toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-3 h-full flex-grow  overflow-y-hidden ">
                                    <div className="flex">
                                        <label
                                            htmlFor="service"
                                            className="block mb-2 text-sm font-medium text-gray-900 "
                                        >
                                            Service Type
                                        </label>
                                        {errors.services && (
                                            <span className="ml-2 text-sm text-red-600">
                                                {errors.services}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2  gap-2 overflow-y-auto  ">
                                        {providerServices.map((service, i) => {
                                            let match = formData.services.find(
                                                (item) =>
                                                    item._id == service._id
                                            );

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() =>
                                                        handleServiceChange(
                                                            service
                                                        )
                                                    }
                                                    className={`cursor-pointer h-14 border rounded-xl p-3 flex justify-between items-center transition hover:shadow-sm
                                                     ${
                                                         match
                                                             ? "border-indigo-500 bg-indigo-50"
                                                             : "border-slate-200 bg-white dark:bg-slate-800"
                                                     }
                                                     `}
                                                >
                                                    <div>
                                                        <h2 className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                            {service.name}
                                                        </h2>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {service.duration}{" "}
                                                            min
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                        ${service.price}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Summary bar */}
                                <div className="mt-auto bg-white  border-t border-gray-200  pt-3 pb-3 px-4 flex items-center justify-between  ">
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {selectedTotals.length} service(s)
                                            selected
                                        </p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                            Total: ${selectedTotals.price} •{" "}
                                            {selectedTotals.duration} min
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {currentPage === 3 && (
                        <>
                            {errors.date && (
                                <span className="ml-2 text-sm py-2 text-red-600">
                                    {errors.date}
                                </span>
                            )}

                            <TimeSlot
                                formData={formData}
                                setFormData={setFormData}
                                store={user.selectedStore._id}
                            />
                        </>
                    )}

                    {currentPage === 4 && (
                        <>
                            <div className=" space-y-3 flex flex-grow flex-col h-full w-full p-4">
                                <h2 className="font-bold text-lg">
                                    Confirm Appointment
                                </h2>
                                <div className="flex flex-col ">
                                    <Label>Client:</Label>
                                    <p>
                                        {formData.client?.first}{" "}
                                        {formData.client?.last}
                                    </p>
                                </div>
                                <div className="flex flex-col ">
                                    <Label>Date:</Label>
                                    <p>{formData.date.toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col ">
                                    <Label>Time:</Label>
                                    <p>{formData.slot.time}</p>
                                </div>
                                <div className="flex flex-col ">
                                    <Label>Service Provider:</Label>
                                    <p>
                                        {formData.provider?.first}{" "}
                                        {formData.provider?.last}
                                    </p>
                                </div>
                                <label
                                    htmlFor="service"
                                    className="block mb-2 text-sm font-medium text-gray-900 "
                                >
                                    Service Type
                                </label>
                                <div className="grid grid-cols-2 h-full gap-2 overflow-y-auto  ">
                                    {formData.services.map((service, i) => {
                                        return (
                                            <div
                                                key={i}
                                                className={` h-14 border border-slate-200 bg-white rounded-xl p-3 flex justify-between items-center transition hover:shadow-sm`}
                                            >
                                                <div>
                                                    <h2 className="font-medium text-sm text-slate-900 =">
                                                        {service.name}
                                                    </h2>
                                                    <p className="text-xs text-slate-500 ">
                                                        {service.duration} min
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-900 ">
                                                    ${service.price}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex sticky bottom-0 mt-auto gap-1">
                        <div
                            type=""
                            className={`${
                                currentPage == 1 && "hidden"
                            } px-4 w-1/2 py-2 bg-gray-400 shadow-md text-white rounded-sm flex justify-center items-center gap-1 cursor-pointer`}
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage((prev) =>
                                    prev - 1 > 0 ? prev - 1 : 1
                                );
                            }}
                        >
                            Back
                        </div>

                        {currentPage == 4 ? (
                            <button
                                className={`${
                                    formData.slot.time ? "" : "opacity-50"
                                }  ml-auto  w-1/2  btn-primary cursor-pointer`}
                            >
                                Submit
                            </button>
                        ) : (
                            <div
                                onClick={() => {
                                    if (currentPage != 4) {
                                        const valid = validate();
                                        console.log(valid);

                                        if (valid) {
                                            setCurrentPage((prev) => prev + 1);
                                        }
                                    }
                                }}
                                className={`${
                                    formData.slot.time ? "" : "opacity-50"
                                }  ml-auto  w-1/2  btn-primary cursor-pointer`}
                            >
                                Next
                            </div>
                        )}
                    </div>
                </form>
            </Modal>
        </>
    );
}
