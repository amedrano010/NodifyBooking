"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { Tabs, TabItem } from "flowbite-react";
import { List, Dropdown, ListItem, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
//import AppointmentForm from "../Forms/AppointmentForm";
//import { UserContext } from "../Context/UserContext";

function HomePage(props) {
    //const { user, setUser } = useContext(UserContext);

    const [user, setUser] = useState({
        _id: "12345",
        first: "John",
    });

    const [openModal, setOpenModal] = useState(false);
    const [refreshAppointments, setRefreshAppointments] = useState(false);
    const [appointments, setAppointments] = useState([
        {
            _id: "12345",
            text: "test",
            date: new Date(),
            status: "Scheduled",
            type: "Appointment",
            customer: {
                first: "Abram",
                last: "Medrano",
            },
            services: [{ name: "hair cut" }],

            phone: "361687888",
            provider: "Ellie",
        },
        {
            _id: "12345",
            text: "test",
            date: new Date(),
            status: "Scheduled",
            type: "Appointment",
            customer: {
                first: "Abram",
                last: "Medrano",
            },
            services: [{ name: "hair cut" }],

            phone: "361687888",
            provider: "Ellie",
        },
        {
            _id: "12345",
            text: "test",
            date: new Date(),
            status: "Scheduled",
            type: "Appointment",
            customer: {
                first: "Abram",
                last: "Medrano",
            },
            services: [{ name: "hair cut" }],

            phone: "361687888",
            provider: "Ellie",
        },
        {
            _id: "12345",
            text: "test",
            date: new Date(),
            status: "Scheduled",
            type: "Appointment",
            customer: {
                first: "Abram",
                last: "Medrano",
            },
            services: [{ name: "hair cut" }],

            phone: "361687888",
            provider: "Ellie",
        },
    ]);

    const [accountLinkCreatePending, setAccountLinkCreatePending] =
        useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        return;
        if (user) {
            axios
                .get(`${process.env.REACT_APP_BASE_URL}/appointments`, {
                    params: {
                        store: user.selectedStore,
                        start: moment(new Date()).startOf("day").toDate(),
                        end: moment(new Date()).endOf("day").toDate(),
                    },
                })
                .then((res) => {
                    console.log(res);
                    const appointments = res.data;
                    setAppointments(appointments);
                })
                .catch((error) => {
                    console.error(
                        "There was an error fetching the appointments!",
                        error
                    );
                });
        }
    }, [refreshAppointments, user]);

    const handleDelete = (id) => {
        return;
        axios
            .delete(`${process.env.REACT_APP_BASE_URL}/appointments/${id}`)
            .then(() => {
                console.log("item deleted successfully");
                setRefreshAppointments((prev) => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleUpdate = (id, data) => {
        return;
        axios
            .put(`${process.env.REACT_APP_BASE_URL}/appointments/${id}`, data)
            .then(() => {
                console.log("item updated successfully");
                setRefreshAppointments((prev) => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const theme = {
        base: "flex flex-col gap-2 h-full max-h-full overflow-hidden",
        tablist: {
            base: "flex text-center",
            variant: {
                default:
                    "flex-wrap border-b border-gray-200 dark:border-gray-700",
                underline:
                    "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
                pills: "flex-wrap space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400",
                fullWidth:
                    "grid w-full grid-flow-col divide-x divide-gray-200 rounded-none text-sm font-medium shadow dark:divide-gray-700 dark:text-gray-400",
            },
            tabitem: {
                base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none  disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
                variant: {
                    default: {
                        base: "rounded-t-lg",
                        active: {
                            on: "bg-gray-100 text-cyan-600 dark:bg-gray-800 dark:text-cyan-500",
                            off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                        },
                    },
                    underline: {
                        base: "rounded-t-lg",
                        active: {
                            on: "active rounded-t-lg border-b-2 border-cyan-600 text-cyan-600 dark:border-cyan-500 dark:text-cyan-500",
                            off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
                        },
                    },
                    pills: {
                        base: "",
                        active: {
                            on: "rounded-lg bg-cyan-600 text-white",
                            off: "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
                        },
                    },
                    fullWidth: {
                        base: "ml-0 flex w-full rounded-none first:ml-0",
                        active: {
                            on: "active rounded-none bg-gray-100 p-4 text-gray-900 dark:bg-gray-700 dark:text-white",
                            off: "rounded-none bg-white hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white",
                        },
                    },
                },
                icon: "mr-2 h-5 w-5",
            },
        },
        tabitemcontainer: {
            base: "flex flex-col max-h-full h-full overflow-hidden",
            variant: {
                default: "",
                underline: "",
                pills: "",
                fullWidth: "",
            },
        },
        tabpanel: "h-full overflow-hidden",
    };

    return (
        <>
            {user === null || user._id === undefined ? (
                <div>Loading....</div>
            ) : (
                <div className="flex flex-col h-full max-h-full ">
                    {/*
                    <AppointmentForm
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        setRefreshAppointments={setRefreshAppointments}
                    />
                  */}

                    {user &&
                        (!user.charges_enabled ||
                            !user.details_submitted ||
                            !user.payouts_enabled) && (
                            <>
                                <div className="card gap-2 mb-3 flex flex-col md:flex-row justify-between md:items-center hidden">
                                    {user && user.stripeId && (
                                        <h2>
                                            Please complete your Stripe account
                                            setup to start accepting payments.
                                        </h2>
                                    )}
                                    <div className="content">
                                        {user &&
                                            user.stripeId &&
                                            !accountLinkCreatePending && (
                                                <button
                                                    className="bg-indigo-500 text-white rounded-sm shadow-lg py-2 px-4 cursor-pointer"
                                                    onClick={async () => {
                                                        setAccountLinkCreatePending(
                                                            true
                                                        );
                                                        setError(false);
                                                        fetch(
                                                            `${process.env.REACT_APP_BASE_URL}/stripe/account_link`,
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type":
                                                                        "application/json",
                                                                },
                                                                body: JSON.stringify(
                                                                    {
                                                                        account:
                                                                            user.stripeId,
                                                                    }
                                                                ),
                                                            }
                                                        )
                                                            .then((response) =>
                                                                response.json()
                                                            )
                                                            .then((json) => {
                                                                setAccountLinkCreatePending(
                                                                    false
                                                                );

                                                                const {
                                                                    url,
                                                                    error,
                                                                } = json;
                                                                if (url) {
                                                                    window.location.href =
                                                                        url;
                                                                }

                                                                if (error) {
                                                                    setError(
                                                                        true
                                                                    );
                                                                }
                                                            });
                                                    }}
                                                >
                                                    Setup Stripe
                                                </button>
                                            )}
                                        {error && (
                                            <p className="error">
                                                Something went wrong!
                                            </p>
                                        )}
                                        {((user && user.stripeId) ||
                                            accountLinkCreatePending) && (
                                            <div className="dev-callout">
                                                {accountLinkCreatePending && (
                                                    <p>
                                                        Creating a new Account
                                                        Link...
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                    <div className="card flex flex-col h-full lg:h-full w-full max-w-full overflow-y-hidden">
                        <nav className="flex justify-between">
                            <div className="title">Dashboard</div>
                            <div>
                                <button
                                    onClick={() => {
                                        setOpenModal(true);
                                    }}
                                    className="btn-primary hidden"
                                >
                                    <PlusCircleIcon className="h-5" /> New
                                </button>
                            </div>
                        </nav>

                        <Tabs
                            theme={theme}
                            aria-label="Tabs with underline"
                            variant="underline"
                        >
                            <TabItem title="Upcoming">
                                <List unstyled className="divide-y">
                                    {appointments
                                        .filter(
                                            (item) =>
                                                item.status === "Scheduled"
                                        )
                                        ?.map((item, i) => {
                                            return (
                                                <ListItem
                                                    className={` px-2 rounded-xs py-3 ${
                                                        item.status ===
                                                        "Confirmed"
                                                            ? "bg-green-100"
                                                            : ""
                                                    } ${
                                                        item.status ===
                                                        "Cancelled"
                                                            ? "bg-red-100"
                                                            : ""
                                                    } w-full`}
                                                    key={i}
                                                >
                                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                        <div className="flex gap-2 flex-1 flex-row">
                                                            <div>
                                                                <p className="truncate text-base font-medium text-gray-700 ">
                                                                    {
                                                                        item
                                                                            .customer
                                                                            .first
                                                                    }{" "}
                                                                    {
                                                                        item
                                                                            .customer
                                                                            .last
                                                                    }
                                                                </p>
                                                                <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                                    <ul>
                                                                        {item.services.map(
                                                                            (
                                                                                service,
                                                                                i
                                                                            ) => {
                                                                                return (
                                                                                    <li
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            service.name
                                                                                        }
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="text-sm">
                                                                {moment(
                                                                    item.startDate
                                                                ).format(
                                                                    "MM/DD"
                                                                )}
                                                            </div>
                                                            <div className="inline-flex items-center text-sm  text-gray-600">
                                                                {moment(
                                                                    item.startDate
                                                                ).format(
                                                                    "hh:mm A"
                                                                )}{" "}
                                                                -{" "}
                                                                {moment(
                                                                    item.endDate
                                                                ).format(
                                                                    "hh:mm A"
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 ">
                                                            <Dropdown
                                                                label=""
                                                                inline
                                                            >
                                                                {item.status ===
                                                                "Confirmed" ? (
                                                                    <DropdownItem
                                                                        onClick={() => {
                                                                            handleUpdate(
                                                                                item._id,
                                                                                {
                                                                                    status: "Scheduled",
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        Undo
                                                                        confirm
                                                                    </DropdownItem>
                                                                ) : (
                                                                    <DropdownItem
                                                                        onClick={() => {
                                                                            handleUpdate(
                                                                                item._id,
                                                                                {
                                                                                    status: "Confirmed",
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        Confirm
                                                                    </DropdownItem>
                                                                )}

                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        handleUpdate(
                                                                            item._id,
                                                                            {
                                                                                status: "Cancelled",
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    Checkout
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        handleDelete(
                                                                            item._id
                                                                        );
                                                                    }}
                                                                >
                                                                    Delete
                                                                </DropdownItem>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </ListItem>
                                            );
                                        })}
                                </List>
                            </TabItem>
                            <TabItem title="Completed">
                                <List
                                    unstyled
                                    className="divide-y divide-gray-200 dark:divide-gray-700 px-2"
                                >
                                    {appointments
                                        .filter(
                                            (item) => item.status === "Complete"
                                        )
                                        ?.map((item, i) => {
                                            return (
                                                <ListItem
                                                    className={` px-2 rounded-md py-3 ${
                                                        item.status ===
                                                        "Confirmed"
                                                            ? "bg-green-100"
                                                            : ""
                                                    } ${
                                                        item.status ===
                                                        "Cancelled"
                                                            ? "bg-red-100"
                                                            : ""
                                                    } w-full`}
                                                    key={i}
                                                >
                                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                        <div className="flex gap-2 flex-1 flex-row">
                                                            <div>
                                                                <p className="truncate text-base font-medium text-gray-700 ">
                                                                    {
                                                                        item
                                                                            .customer
                                                                            .first
                                                                    }{" "}
                                                                    {
                                                                        item
                                                                            .customer
                                                                            .last
                                                                    }
                                                                </p>
                                                                <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                                    <ul>
                                                                        {item.services.map(
                                                                            (
                                                                                service,
                                                                                i
                                                                            ) => {
                                                                                return (
                                                                                    <li
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            service.name
                                                                                        }
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="text-sm">
                                                                {moment(
                                                                    item.startDate
                                                                ).format(
                                                                    "MM/DD"
                                                                )}
                                                            </div>
                                                            <div className="inline-flex items-center text-sm  text-gray-600">
                                                                {moment(
                                                                    item.startDate
                                                                ).format(
                                                                    "hh:mm A"
                                                                )}{" "}
                                                                -{" "}
                                                                {moment(
                                                                    item.endDate
                                                                ).format(
                                                                    "hh:mm A"
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 ">
                                                            <Dropdown
                                                                label=""
                                                                inline
                                                            >
                                                                {item.status ===
                                                                "Confirmed" ? (
                                                                    <DropdownItem
                                                                        onClick={() => {
                                                                            handleUpdate(
                                                                                item._id,
                                                                                {
                                                                                    status: "Scheduled",
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        Undo
                                                                        confirm
                                                                    </DropdownItem>
                                                                ) : (
                                                                    <DropdownItem
                                                                        onClick={() => {
                                                                            handleUpdate(
                                                                                item._id,
                                                                                {
                                                                                    status: "Confirmed",
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        Confirm
                                                                    </DropdownItem>
                                                                )}

                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        handleUpdate(
                                                                            item._id,
                                                                            {
                                                                                status: "Cancelled",
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <Link to="/pos/cart">
                                                                        Checkout
                                                                    </Link>
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        handleDelete(
                                                                            item._id
                                                                        );
                                                                    }}
                                                                >
                                                                    Delete
                                                                </DropdownItem>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </ListItem>
                                            );
                                        })}
                                </List>
                            </TabItem>
                            <TabItem title="Missed">
                                <List
                                    unstyled
                                    className="divide-y divide-gray-200 dark:divide-gray-700 px-2"
                                >
                                    {appointments
                                        .filter(
                                            (item) => item.status === "Missed"
                                        )
                                        .map((item, i) => {
                                            return (
                                                <ListItem
                                                    className={` px-2 rounded-md py-3 ${
                                                        item.status ===
                                                        "Confirmed"
                                                            ? "bg-green-100"
                                                            : ""
                                                    } ${
                                                        item.status ===
                                                        "Cancelled"
                                                            ? "bg-red-100"
                                                            : ""
                                                    } w-full`}
                                                    key={i}
                                                >
                                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                        <div className="flex gap-2 flex-1 flex-row">
                                                            <div>
                                                                <p className="truncate text-base font-medium text-gray-700 ">
                                                                    {
                                                                        item
                                                                            .customer
                                                                            .first
                                                                    }{" "}
                                                                    {
                                                                        item
                                                                            .customer
                                                                            .last
                                                                    }
                                                                </p>
                                                                <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                                    <ul>
                                                                        {item.services.map(
                                                                            (
                                                                                service,
                                                                                i
                                                                            ) => {
                                                                                return (
                                                                                    <li
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            service.name
                                                                                        }
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="text-sm">
                                                                {moment(
                                                                    item.startDate
                                                                ).format(
                                                                    "MM/DD"
                                                                )}
                                                            </div>
                                                            <div className="inline-flex items-center text-sm  text-gray-600">
                                                                {moment(
                                                                    item.startDate
                                                                ).format(
                                                                    "hh:mm A"
                                                                )}{" "}
                                                                -{" "}
                                                                {moment(
                                                                    item.endDate
                                                                ).format(
                                                                    "hh:mm A"
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 ">
                                                            <Dropdown
                                                                label=""
                                                                inline
                                                            >
                                                                {item.status ===
                                                                "Confirmed" ? (
                                                                    <DropdownItem
                                                                        onClick={() => {
                                                                            handleUpdate(
                                                                                item._id,
                                                                                {
                                                                                    status: "Scheduled",
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        Undo
                                                                        confirm
                                                                    </DropdownItem>
                                                                ) : (
                                                                    <DropdownItem
                                                                        onClick={() => {
                                                                            handleUpdate(
                                                                                item._id,
                                                                                {
                                                                                    status: "Confirmed",
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        Confirm
                                                                    </DropdownItem>
                                                                )}

                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        handleUpdate(
                                                                            item._id,
                                                                            {
                                                                                status: "Cancelled",
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <Link to="/pos/cart">
                                                                        Checkout
                                                                    </Link>
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => {
                                                                        handleDelete(
                                                                            item._id
                                                                        );
                                                                    }}
                                                                >
                                                                    Delete
                                                                </DropdownItem>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </ListItem>
                                            );
                                        })}
                                </List>
                            </TabItem>
                        </Tabs>

                        <div className="overflow-y-auto"></div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HomePage;
