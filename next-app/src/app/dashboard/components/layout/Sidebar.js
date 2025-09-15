import React, { useState, useContext } from "react";
import Image from "next/image";

import { usePathname } from "next/navigation";

import { XMarkIcon } from "@heroicons/react/24/solid";

import Link from "next/link";

function Sidebar({ isOpen, setSidebarOpen, navLinks }) {
    const path = usePathname();

    return (
        <div
            className={`overflow-hidden absolute sm:static left z-30 h-full  transition-all transition-width duration-500 ease-in-out bg-gray-600 sm:flex flex-col text-white ${
                isOpen ? `w-46` : `w-0 sm:w-16`
            }`}
        >
            <div className="relative flex items-center justify-center h-16 max-h-16 w-full border-red-500 p-4">
                <Image
                    src={"/loop-logo.png"}
                    width={32}
                    height={32}
                    alt="logo"
                    className=""
                    priority
                    unoptimized
                />
                <div className="hidden font-bold">🚀</div>
                <div
                    className={`${
                        isOpen ? "" : "hidden"
                    } absolute top-3 right-4`}
                >
                    <XMarkIcon
                        onClick={() => {
                            setSidebarOpen(false);
                        }}
                        className="h-5"
                    />
                </div>
            </div>
            <div
                className={`${
                    isOpen ? "justify-center" : "justify-center"
                } flex h-full mt-4 w-full`}
            >
                <ul
                    className={`navLink transition-all transition-padding duration-500 ease-in-out  flex flex-col  gap-10 w-fit`}
                >
                    {navLinks.map((item, i) => {
                        return (
                            <Link
                                key={i}
                                href={item.href}
                                className={`${
                                    path == item.href
                                        ? "font-extrabold text-white text-lg"
                                        : "font-light text-gray-300"
                                } flex text-center  ${
                                    isOpen ? "justify-start" : "justify-center"
                                }  items-center ${item.class} h-5 `}
                            >
                                <div
                                    className={` text-center   ${
                                        isOpen ? `mr-2` : `hidden sm:block`
                                    }  `}
                                >
                                    {item.icon}
                                </div>
                                <div
                                    className={`
                                    ${isOpen ? `flex` : `hidden`} 
                                 
                                `}
                                >
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
