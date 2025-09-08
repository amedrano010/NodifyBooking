import React from "react";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
} from "flowbite-react";

function AddMenu(props) {
    return (
        <div className="border border-gray-400 rounded-xs h-8 flex text-white sm:text-gray-600 p-3">
            <Dropdown
                className=""
                arrowIcon={true}
                inline
                label={
                    <div className="flex items-center justify-center gap-1 ">
                        <PlusCircleIcon className="h-5 w-5 " />
                        <p>New</p>
                    </div>
                }
            >
                <DropdownItem>Appointment</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Customer</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Service</DropdownItem>
                <DropdownDivider />
                <DropdownItem>Product</DropdownItem>
            </Dropdown>
        </div>
    );
}

export default AddMenu;
