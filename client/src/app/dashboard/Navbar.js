"use client";

import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
    Cog6ToothIcon,
    PlusIcon,
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

import AddMenu from "./AddMenu";

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
        <div className=" flex flex-col bg-[var(--color-onyx)] sm:bg-[var(--color-whitish)] border-b border-b-gray-300 ">
            <div className="flex px-2 py-2  w-full md:order-2  justify-between">
                <div
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    className="flex justify-center items-center gap-2 "
                >
                    <Bars3Icon className="h-6 w-6 text-white sm:text-gray-600" />
                    <p className="text-lg text-white sm:text-gray-600">
                        Nodify
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <AddMenu />

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
                className={`menu absolute left-0 top-14 z-50 border-b border-gray-300 sm:hidden w-full list-none bg-[var(--color-onyx)] text-white shadow-lg ${
                    sidebarOpen ? "flex flex-col" : "hidden"
                }`}
            >
                {navLinks.map((link, i) => {
                    return (
                        <Link
                            className={`p-2 ${link.class} ${
                                link.href == pathname
                                    ? "bg-[var(--color-silver)] text-onyx"
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
