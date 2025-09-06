"use client";

import React, { useState, useEffect, useContext } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
//import { UserContext } from "../Context/UserContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { PlusIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { useUser } from "../context/userContext";

const localizer = momentLocalizer(moment);

const CalendarPage = (props) => {
    //console.log(moment("29/1/2025 09:15:00", "DD/MM/YYYY hh:mm:ss"));
    //const { user } = useContext(UserContext);
    const { user, setUser } = useUser();
    const [appointments, setappointments] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BASE_URL}/appointments`, {
                params: {
                    selectedStore: user.selectedStore,
                },
            })
            .then((response) => {
                console.log(response);
                const appointments = response?.data?.map((appointment) => ({
                    title: `${appointment.customer.first} ${
                        appointment.customer.last
                    }: \n ${appointment.services
                        .map((item) => item.name)
                        .join(", ")}`,
                    start: new Date(moment(appointment.startDate)),
                    end: new Date(moment(appointment.endDate)),
                }));

                setappointments(appointments);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the appointments!",
                    error
                );
            });
    }, [refresh]);

    return (
        <div className="calendarpage flex flex-col h-full max-h-full ">
            <div className="mb-2 text-2xl font-semibold">Calendar</div>
            <div className="card h-full flex flex-col gap-2 overflow-hidden ">
                <Calendar
                    className=""
                    localizer={localizer}
                    events={appointments}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="day"
                    step={15}
                    selectable
                    timeslots={4}
                    views={{
                        day: true,
                        week: true,
                        month: true,
                        agenda: false,
                    }}
                    min={new Date(2025, 0, 29, 6, 0)} // Start at 6 AM
                    max={new Date(2025, 0, 29, 23, 59)} // End at 11:59 PM
                    onSelectSlot={(e) => console.log(e)}
                />
            </div>
        </div>
    );
};

export default CalendarPage;
