"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { Tabs, TabItem } from "flowbite-react";
import { List, Dropdown, ListItem, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useUser } from "./context/userContext";
//import AppointmentForm from "../Forms/AppointmentForm";
//import { UserContext } from "../Context/UserContext";
import AppointmentsList from "./components/ui/AppointmentsList";

import { useAppointments } from "./context/appointmentContext";

const theme = {
    base: "flex flex-col gap-2 h-full max-h-full overflow-hidden",
    tablist: {
        base: "flex text-center",
        variant: {
            default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
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

function HomePage(props) {
    const { user } = useUser();

    const { appointments } = useAppointments();

    const [accountLinkCreatePending, setAccountLinkCreatePending] =
        useState(false);
    const [error, setError] = useState(false);

    return (
        <>
            {user === null || user._id === undefined ? (
                <div>Loading....</div>
            ) : (
                <div className="flex flex-col h-full max-h-full ">
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

                    <div className="card flex flex-col w-full">
                        <Tabs
                            theme={theme}
                            aria-label="Tabs with underline"
                            variant="underline"
                        >
                            <TabItem title="Upcoming">
                                <AppointmentsList
                                    appointments={appointments.filter(
                                        (appointment) =>
                                            appointment.status == "Scheduled" ||
                                            appointment.status == "Confirmed"
                                    )}
                                />
                            </TabItem>
                            <TabItem title="Completed">
                                {" "}
                                <AppointmentsList
                                    appointments={appointments.filter(
                                        (appointment) =>
                                            appointment.status == "Completed"
                                    )}
                                />
                            </TabItem>
                            <TabItem title="Missed">
                                {" "}
                                <AppointmentsList
                                    appointments={appointments.filter(
                                        (appointment) =>
                                            appointment.status == "Missed"
                                    )}
                                />
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
