"use client";

import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import {
    Avatar,
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
} from "flowbite-react";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Component({
    user,
    sidebarOpen,
    setSidebarOpen,
    navLinks,
}) {
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = () => {
        return;
        try {
            axios.post(`/login/signout`).then((res) => {
                router("/login");
            });
        } catch (e) {
            console.log("error signing out");
        }
    };

    const handleStoreChange = (e) => {
        return;
        const selectedStoreId = e.target.value;
        const selectedStore = user.company.stores.find(
            (store) => store._id === selectedStoreId
        );

        setUser((prev) => ({
            ...prev,
            selectedStore: selectedStore._id,
        }));
    };

    return (
        <div className="flex flex-col   bg-white ">
            <div className="flex px-2 py-2  w-full md:order-2 border-b border-gray-200 justify-between">
                <div
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    className="flex justify-center items-center "
                >
                    <Bars3Icon className="h-6 w-6 text-gray-600" />
                </div>

                <div className="flex items-center gap-2">
                    <div>
                        <BellIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <Dropdown
                        className=""
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="User settings"
                                //img={user?.avatar ? user.avatar : null}
                                img="https://images.pexels.com/photos/800330/pexels-photo-800330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                rounded
                            />
                        }
                    >
                        <DropdownHeader>
                            <span className="block text-sm">
                                {user?.first ? user.first : ""}{" "}
                                {user?.last ? user.last[0].toUpperCase() : ""}{" "}
                            </span>
                            <span className="block truncate text-sm font-medium">
                                {user?.email}
                            </span>
                        </DropdownHeader>

                        <DropdownItem>Store details</DropdownItem>
                        <DropdownItem>
                            <Link href={`/profile`}>Profile</Link>
                        </DropdownItem>
                        <DropdownItem>Settings</DropdownItem>

                        <DropdownDivider />
                        <DropdownItem onClick={handleSignOut}>
                            Sign out
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>
            <div
                className={`border-b border-gray-200 sm:hidden w-full list-none ${
                    sidebarOpen ? "flex flex-col" : "hidden"
                } `}
            >
                {navLinks.map((link, i) => {
                    return (
                        <Link
                            className={`p-2 ${
                                link.href == pathname
                                    ? "bg-slate-500 text-white"
                                    : ""
                            }`}
                            key={i}
                            href={link.href}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
