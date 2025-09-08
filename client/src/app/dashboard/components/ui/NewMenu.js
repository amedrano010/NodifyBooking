"use client";
import React, { useState } from "react";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import {
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
} from "flowbite-react";

import AppointmentForm from "@/app/dashboard/forms/AppointmentForm";
import ClientForm from "@/app/dashboard/forms/ClientForm";

function NewMenu(props) {
    //FORMS STATE
    const [openAppointment, setOpenAppointment] = useState(false);
    const [openClient, setOpenClient] = useState(false);

    return (
        <>
            <AppointmentForm
                open={openAppointment}
                setOpen={setOpenAppointment}
            />
            <ClientForm open={openClient} setOpen={setOpenClient} />
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
                    <DropdownItem onClick={() => setOpenAppointment(true)}>
                        Appointment
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={() => setOpenClient(true)}>
                        Client
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem>Service</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem>Product</DropdownItem>
                </Dropdown>
            </div>
        </>
    );
}

export default NewMenu;
