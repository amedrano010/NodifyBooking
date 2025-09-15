"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";

import {
    Avatar,
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
    Select,
    Label,
} from "flowbite-react";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "../../context/userContext";

import AddMenu from "../ui/NewMenu";

export default function Component({ sidebarOpen, setSidebarOpen, navLinks }) {
    const router = useRouter();
    const pathname = usePathname();

    const { user, setUser } = useUser();

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
        const selectedStoreId = e.target.value;

        const selectedStore = user.stores.find(
            (store) => store._id == selectedStoreId
        );

        setUser((prev) => ({
            ...prev,
            selectedStore: selectedStore,
        }));
    };

    return (
        <div className=" flex flex-col bg-white border-b  border-b-gray-300 text-gray-500 ">
            <div className="flex px-2 py-2  w-full md:order-2  justify-between">
                <div className="flex justify-center items-center gap-2">
                    <Bars3Icon
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        className="h-6 w-6  sm:text-gray-600 mr-1"
                    />

                    <div className="w-30 sm:w-50">
                        <Select
                            className=""
                            onChange={handleStoreChange}
                            id="stores"
                            required
                        >
                            {user.stores.map((store, i) => {
                                return (
                                    <option key={i} value={store._id}>
                                        {store.name}
                                    </option>
                                );
                            })}
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <AddMenu />

                    <div className="border-l px-2 ml-2 border-gray-200 ">
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
                                    {user?.last
                                        ? user.last[0].toUpperCase()
                                        : ""}{" "}
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
            </div>

            {/* <div
                className={`menu absolute left-0 top-14 z-50 border-b border-gray-300 sm:hidden w-full list-none bg-[var(--color-whitish)]   shadow-sm ${
                    sidebarOpen ? "flex flex-col" : "hidden"
                }`}
            >
                {navLinks.map((link, i) => {
                    return (
                        <Link
                            className={`flex  gap-2 p-4 ${link.class} ${
                                link.href == pathname
                                    ? "bg-gray-500 text-gray-300"
                                    : ""
                            }`}
                            key={i}
                            href={link.href}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <div>{link.icon}</div>
                            <div> {link.name}</div>
                        </Link>
                    );
                })}
            </div>*/}
        </div>
    );
}
