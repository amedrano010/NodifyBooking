"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
    CalendarDaysIcon,
    PlusCircleIcon,
    SparklesIcon,
    ShoppingBagIcon,
    UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
    Dropdown,
    DropdownHeader,
    DropdownItem,
    DropdownDivider,
} from "flowbite-react";

import AppointmentForm from "../../forms/AppointmentForm";
import ClientForm from "../../forms/ClientForm";
import ServiceForm from "/app/dashboard/forms/ServiceForm.js";
import ProductForm from "/app/dashboard/forms/ProductForm";

function NewMenu(props) {
    //FORMS STATE
    const [openAppointment, setOpenAppointment] = useState(false);
    const [openClient, setOpenClient] = useState(false);
    const [openService, setOpenService] = useState(false);
    const [openProduct, setOpenProduct] = useState(false);

    const menuItems = [
        {
            text: "Appointment",
            handleClick: () => {
                setOpenAppointment(true);
            },
            icon: <CalendarDaysIcon className="h-5 w-5" />,
        },
        {
            text: "Client",
            handleClick: () => {
                setOpenClient(true);
            },
            icon: <UserPlusIcon className="h-5 w-5" />,
        },
        {
            text: "Service",
            handleClick: () => {},
            icon: <SparklesIcon className="h-5 w-5" />,
            handleClick: () => {
                setOpenService(true);
            },
        },
        {
            text: "Product",
            handleClick: () => {},
            icon: <ShoppingBagIcon className="h-5 w-5" />,
            handleClick: () => {
                setOpenProduct(true);
            },
        },
    ];

    return (
        <>
            <AppointmentForm
                open={openAppointment}
                setOpen={setOpenAppointment}
            />
            <ClientForm open={openClient} setOpen={setOpenClient} />
            <ServiceForm open={openService} setOpen={setOpenService} />
            <ProductForm open={openProduct} setOpen={setOpenProduct} />
            <div className="btn-primary ">
                <Dropdown
                    className="w-40 "
                    arrowIcon={true}
                    inline
                    label={
                        <div className="flex items-center justify-center gap-1 ">
                            <PlusCircleIcon className="h-5 w-5 " />
                            <p>New</p>
                        </div>
                    }
                >
                    {menuItems.map((item, i) => {
                        return (
                            <div key={i} className="">
                                {i == 0 ? <></> : <DropdownDivider />}
                                <DropdownItem
                                    className="flex gap-2 !w-full"
                                    onClick={item.handleClick}
                                >
                                    {item.icon}
                                    {item.text}
                                </DropdownItem>
                            </div>
                        );
                    })}
                </Dropdown>
            </div>
        </>
    );
}

export default NewMenu;
