import React from "react";
import { List, Dropdown, ListItem, DropdownItem } from "flowbite-react";
import moment from "moment";
import axios from "axios";
import { useAppointments } from "../../context/appointmentContext";

function AppointmentsList({ appointments }) {
    const { setAppointments, setRefreshAppointments } = useAppointments();

    const handleUpdate = (id, data) => {
        axios
            .put(`${process.env.NEXT_PUBLIC_BASE_URL}/appointments/${id}`, data)
            .then(() => {
                setRefreshAppointments((prev) => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function handleExpand(id) {
        setAppointments((prevAppointments) => {
            return prevAppointments.map((appointment) => {
                return appointment._id == id
                    ? { ...appointment, expanded: !appointment.expanded }
                    : appointment;
            });
        });
    }

    return (
        <>
            <List unstyled className="divide-y">
                {appointments.length == 0 && (
                    <div className="text-center text-sm">No data</div>
                )}
                {appointments?.map((item, i) => {
                    return (
                        <ListItem
                            className={` px-3 rounded-xs border-b-gray-300  py-3 ${
                                item.status === "Confirmed"
                                    ? "bg-green-100"
                                    : ""
                            } ${
                                item.status === "Cancelled" ? "bg-red-100" : ""
                            } w-full`}
                            key={i}
                        >
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="flex gap-2 flex-1 flex-row">
                                    <div>
                                        <p className="truncate text-base font-medium text-gray-700 ">
                                            {item.client.first}{" "}
                                            {item.client.last}
                                        </p>
                                        <div className="truncate  text-sm text-gray-500 dark:text-gray-400">
                                            <p>{item.client.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="text-sm">
                                        {moment(item.startDate).format("MM/DD")}
                                    </div>
                                    <div className="inline-flex items-center text-sm  text-gray-600">
                                        {moment(item.startDate).format(
                                            "hh:mm A"
                                        )}{" "}
                                        -{" "}
                                        {moment(item.endDate).format("hh:mm A")}
                                    </div>
                                </div>

                                <div className="flex gap-2 ">
                                    <Dropdown label="" inline>
                                        {item.status === "Confirmed" ? (
                                            <DropdownItem
                                                onClick={() => {
                                                    handleUpdate(item._id, {
                                                        status: "Scheduled",
                                                    });
                                                }}
                                            >
                                                Undo confirm
                                            </DropdownItem>
                                        ) : (
                                            <DropdownItem
                                                onClick={() => {
                                                    handleUpdate(item._id, {
                                                        status: "Confirmed",
                                                    });
                                                }}
                                            >
                                                Confirm
                                            </DropdownItem>
                                        )}

                                        <DropdownItem
                                            onClick={() => {
                                                handleUpdate(item._id, {
                                                    status: "Cancelled",
                                                });
                                            }}
                                        >
                                            Cancel
                                        </DropdownItem>
                                        <DropdownItem>Checkout</DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="my-2 flex flex-col">
                                <div
                                    onClick={() => {
                                        handleExpand(item._id);
                                    }}
                                    className="text-sm  inline "
                                >
                                    {item.expanded
                                        ? "Hide details"
                                        : "Show details"}
                                </div>
                                <div
                                    className={`text-sm ${
                                        item.expanded ? "" : "hidden"
                                    }`}
                                >
                                    <div className="flex gap-2 mt-2">
                                        <label>Provider:</label>
                                        <p>
                                            {item.provider.first}{" "}
                                            {item.provider.last}
                                        </p>
                                    </div>
                                    <List>
                                        {item.services.map((service, i) => {
                                            return (
                                                <ListItem key={i} className="">
                                                    {service.name}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </div>
                            </div>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
}

export default AppointmentsList;
