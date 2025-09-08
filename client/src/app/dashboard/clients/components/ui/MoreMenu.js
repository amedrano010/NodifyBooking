import React, { useState } from "react";
import Link from "next/link";
import { Dropdown, DropdownItem, DropdownDivider } from "flowbite-react";
import {
    EllipsisHorizontalIcon,
    PhoneIcon,
    PencilIcon,
    UserCircleIcon,
} from "@heroicons/react/16/solid";

export default function MoreMenu({ clientId }) {
    return (
        <>
            <Dropdown
                className=""
                arrowIcon={false}
                inline
                label={
                    <div className="flex items-center justify-center gap-1 cursor-pointer ">
                        <EllipsisHorizontalIcon className="h-5 w-5 " />
                    </div>
                }
            >
                <DropdownItem>
                    <Link
                        className="flex"
                        href={`/dashboard/clients/${clientId}`}
                    >
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        <p>View</p>
                    </Link>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem>
                    <Link
                        className="flex"
                        href={`/dashboard/clients/${clientId}?edit=true`}
                    >
                        <PencilIcon className="h-5 w-5 mr-2" />
                        <p>Edit</p>
                    </Link>
                </DropdownItem>

                <DropdownDivider />
                <DropdownItem>
                    <a href="tel:555-555-5555" className="flex">
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        <p>Call</p>
                    </a>
                </DropdownItem>
            </Dropdown>
        </>
    );
}
