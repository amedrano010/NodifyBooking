"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import {
    HomeIcon,
    CalendarIcon,
    FaceSmileIcon,
    ShoppingCartIcon,
    ShareIcon,
    UserGroupIcon,
    PaperAirplaneIcon,
    CreditCardIcon,
} from "@heroicons/react/24/outline";

import { useUser } from "./context/userContext";
import { useState, createContext, useContext } from "react";

import { Spinner } from "flowbite-react";

function Shell({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, setUser } = useUser();

    const navLinks = [
        {
            name: "Dashboard",
            href: "/",
            icon: <HomeIcon className="h-5" />,
        },

        {
            name: "Calendar",
            href: "/calendar",
            icon: <CalendarIcon className="h-5" />,
        },

        {
            name: "POS",
            href: "/pos",
            icon: <ShoppingCartIcon className="h-5  " />,
            class: "",
        },
        {
            name: "Team",
            href: "/team",
            icon: <UserGroupIcon className="h-5 " />,
            class: "",
        },

        {
            name: "Customers",
            href: "/customers",
            icon: <FaceSmileIcon className="h-5 " />,
            class: "",
        },
        {
            name: "Billing",
            href: "/billing",
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
                <div className="h-screen w-screen flex bg-neutral-100 overflow-hidden">
                    <Sidebar isOpen={sidebarOpen} navLinks={navLinks} />

                    <div className="flex-grow flex flex-col overflow-y-hidden">
                        <Navbar
                            user={user}
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                            navLinks={navLinks}
                        />
                        <div className="flex-grow overflow-y-auto overflow-x-hidden py-2 px-4 lg:px-8 lg:pb-8 lg:pt-4 text-gray-600">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Shell;
