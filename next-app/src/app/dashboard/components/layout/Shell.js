"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import {} from "@heroicons/react/24/outline";

import {
    HomeIcon,
    CalendarIcon,
    FaceSmileIcon,
    ShoppingCartIcon,
    ShareIcon,
    UserGroupIcon,
    PaperAirplaneIcon,
    CreditCardIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";

import { usePathname } from "next/navigation";

import { useUser } from "../../context/userContext";
import { useState, createContext, useContext } from "react";

import { Spinner } from "flowbite-react";

function Shell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, setUser } = useUser();

    const path = usePathname();

    let pageHeader = path.replace("/dashboard", "").split("/")[1];

    if (path == "/dashboard") {
        pageHeader = "Dashboard";
    }

    pageHeader =
        pageHeader.charAt(0).toUpperCase() +
        pageHeader.slice(1, pageHeader.length);

    if (pageHeader == "Pos") pageHeader = "POS";

    const navLinks = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: <HomeIcon className="h-5 " />,
        },

        {
            name: "Calendar",
            href: "/dashboard/calendar",
            icon: <CalendarIcon className="h-5 " />,
        },

        {
            name: "POS",
            href: "/dashboard/pos",
            icon: <ShoppingCartIcon className="h-5  " />,
            class: "",
        },
        {
            name: "Team",
            href: "/dashboard/team",
            icon: <UsersIcon className="h-5 " />,
            class: "",
        },

        {
            name: "Clients",
            href: "/dashboard/clients",
            icon: <FaceSmileIcon className="h-5 " />,
            class: "",
        },
        {
            name: "Stripe",
            href: "/dashboard/billing",
            icon: <CreditCardIcon className="h-5 " />,
            class: "",
        },
    ];

    return (
        <>
            {user == null || !user._id ? (
                <div className="flex justify-center items-center h-full">
                    <Spinner size="xl" aria-label="loading page spinner" />
                </div>
            ) : (
                <div className="h-screen w-screen flex bg-neutral-200 overflow-hidden">
                    <Sidebar
                        isOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        navLinks={navLinks}
                    />

                    <div className="flex-grow flex flex-col overflow-y-hidden">
                        <Navbar
                            user={user}
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                            navLinks={navLinks}
                        />

                        <div className="relative p-4 flex flex-col flex-grow sm:px-8 bg-gray-100 text-pretty overflow-y-auto">
                            {/** Overlay allows clickable area to close side content bar */}
                            <div
                                onClick={() => setSidebarOpen(false)}
                                className={`${
                                    sidebarOpen ? "" : "hidden"
                                } absolute sm:hidden top-0 left-0 right-0 bottom-0  z-10 `}
                            ></div>

                            {/** Main content  */}
                            <h1 className="text-xl py-2  font-semibold">
                                {pageHeader}
                            </h1>
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Shell;
