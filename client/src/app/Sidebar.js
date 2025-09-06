import React, { useState, useContext } from "react";
import Image from "next/image";

import Link from "next/link";

function Sidebar({ isOpen, navLinks }) {
    return (
        <div
            className={`hidden h-full bg-slate-600 sm:flex flex-col text-white ${
                isOpen ? `w-44` : ` lg:block  lg:w-16`
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
            <div className="flex justify-center  h-full pt-4">
                <ul className={`navLink  flex flex-col text-white gap-10`}>
                    {navLinks.map((item, i) => {
                        return (
                            <Link
                                key={i}
                                href={item.href}
                                className={`flex justify-start  items-center ${item.class} h-5`}
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
