import React, { useState, useContext } from "react";
import Image from "next/image";

import Link from "next/link";

function Sidebar({ isOpen, navLinks }) {
    return (
        <div
            className={`hidden h-full bg-[var(--color-onyx)] sm:flex flex-col text-white ${
                isOpen ? `w-50` : ` lg:block  lg:w-16`
            }`}
        >
            <div className=" flex items-center justify-center h-16 w-full p-4">
                <Image
                    src={"/logo.png"}
                    width={40}
                    height={40}
                    alt="logo"
                    className="rounded-full hidden"
                />
                <div className="font-bold">{`{ }`}</div>
            </div>
            <div className="flex justify-center  h-full pt-4 w-full">
                <ul className={`navLink  flex flex-col text-white gap-10 w-36`}>
                    {navLinks.map((item, i) => {
                        return (
                            <Link
                                key={i}
                                href={item.href}
                                className={`flex ${
                                    isOpen ? "justify-start" : "justify-center"
                                }  items-center ${item.class} h-5`}
                            >
                                <div
                                    className={`ml-2 lg:ml-0   ${
                                        isOpen ? `mr-2` : `mr-0`
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
