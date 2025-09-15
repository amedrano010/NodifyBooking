"use client";

import React, { useEffect, useState, useContext } from "react";

import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Datepicker } from "flowbite-react";
import axios from "axios";
//import { UserContext } from "../context/userContext.js";

export default function Slots({ services, store, mode }) {
    const [state, setState] = useState({
        date: new Date(),
    });
    const [slots, setSlots] = useState([]);
    // const { user } = useContext(UserContext);

    useEffect(() => {
        const generateTimeSlots = (start, end, interval) => {
            const aSlots = [];
            let current = start;

            while (current <= end) {
                aSlots.push({
                    id: current.format("HH:mm"),
                    time: current.format("hh:mm A"),
                    status: "available",
                    utc: moment(current).utc(),
                    moment: moment(current),
                    past: false,
                });
                current.add(interval, "minutes");
            }
            setSlots(aSlots);
        };

        generateTimeSlots(
            moment("07:00 AM", "hh:mm A"),
            moment("8:00 PM", "hh:mm A"),
            15
        );
    }, []);

    useEffect(() => {
        setBookedSlots();
    }, [state?.date]);

    function setBookedSlots() {
        if (!state || !state.date) {
            return;
        }

        const duration = services?.reduce((acc, service) => {
            acc += service.duration;

            return acc;
        }, 0);

        try {
            let startOfDay = moment(state.date).startOf("day");
            let endOfDay = moment(state.date).endOf("day");

            axios
                .get(`${process.env.REACT_APP_BASE_URL}/appointments`, {
                    params: {
                        start: startOfDay.toDate(),
                        end: endOfDay.toDate(),
                        store: store,
                    },
                })

                .then((response) => {
                    const appointments = response.data;

                    const currentTime = moment(new Date());

                    setSlots((prevSlots) =>
                        prevSlots.map((slot) => {
                            const time = slot.id;
                            const hrs = time.split(":")[0];
                            const min = time.split(":")[1];
                            const slotDate = new Date(state.date).setHours(
                                hrs,
                                min
                            );

                            const slotMoment = moment(new Date(slotDate));
                            const dSlot = slotMoment.utc();

                            const isBooked = appointments.some(
                                (appointment) => {
                                    const dAppointmentStart = moment(
                                        appointment.startDate
                                    ).utc();

                                    const dAppointmentEnd = moment(
                                        appointment.endDate
                                    ).utc();

                                    return (
                                        dSlot.valueOf() >=
                                            dAppointmentStart.valueOf() &&
                                        dSlot.valueOf() <
                                            dAppointmentEnd.valueOf()
                                    );
                                }
                            );

                            const isWarning = appointments.some(
                                (appointment) => {
                                    const dAppointmentStart = moment(
                                        appointment.startDate
                                    ).utc();

                                    const warningDate = moment(
                                        dAppointmentStart
                                    )
                                        .subtract(duration, "minutes")
                                        .utc();

                                    return (
                                        dSlot.valueOf() >=
                                            warningDate.valueOf() &&
                                        dSlot.valueOf() <
                                            dAppointmentStart.valueOf()
                                    );
                                }
                            );
                            let past = false;
                            if (slotMoment.isBefore(currentTime)) {
                                past = true;
                            }

                            let status = "available";
                            if (isWarning) status = "warning";
                            if (isBooked) status = "booked";

                            return {
                                ...slot,
                                moment: slotMoment,
                                status: status,
                                past: past,
                                utc: dSlot,
                            };
                        })
                    );
                })
                .catch((error) => {
                    console.error(
                        "There was an error fetching services!",
                        error
                    );
                });
        } catch (err) {
            console.log(err);
        }
    }

    const handleDateChange = (d) => {
        setState((prev) => ({ ...prev, date: d, slot: {} }));
    };

    const handleTimeChange = (slot) => {
        setState((prev) => ({ ...prev, slot: slot }));
    };

    return (
        <div className="flex flex-col h-full gap-5 overflow-y-hidden border">
            <Datepicker
                value={state.date}
                onChange={handleDateChange}
                minDate={new Date()}
            />

            <div className="flex flex-col h-full overflow-y-hidden ">
                {" "}
                <div className="flex items-center  justify-between mb-2">
                    <div className="">Pick your time</div>
                    <div className="text-sm text-gray-500">
                        Approx.{" "}
                        {(() => {
                            const totalDuration = moment.duration(
                                services?.reduce((acc, service) => {
                                    acc += service.duration;
                                    return acc;
                                }, 0),
                                "minutes"
                            );

                            const hours = Math.floor(totalDuration.asHours()); // Get total hours
                            const minutes = totalDuration.minutes(); // Get remaining minutes

                            return `${hours}h ${minutes}m`; // Format as "hours:minutes"
                        })()}
                    </div>
                </div>
                <ul
                    id="timetable"
                    className="grid w-full grid-cols-3 gap-2 mb-5 h-full overflow-y-auto px-1"
                >
                    {slots &&
                        slots.length > 0 &&
                        slots.map((slot, i) => {
                            return (
                                <li key={i}>
                                    <input
                                        type="radio"
                                        name="time"
                                        id={slot?.id}
                                        value={slot?.id}
                                        className="hidden peer "
                                        onChange={() => {
                                            handleTimeChange(slot);
                                        }}
                                    />
                                    <label
                                        htmlFor={slot.id}
                                        className={`inline-flex items-center justify-center 
                                    w-full px-2 py-1 text-sm font-medium text-center border rounded-md cursor-pointer text-gray-800 border-gray-300 hover:border hover:border-cyan-800
                                          
                                           ${
                                               slot?.status === "booked" &&
                                               `bg-gray-400 text-white `
                                           }   
                                           ${
                                               slot?.status === "warning" &&
                                               mode !== "admin" &&
                                               "bg-gray-400 text-white "
                                           } 
                                           ${slot?.status === "warning" && ""} 
                                           ${
                                               slot?.status === "available" &&
                                               ""
                                           } 
                                           ${
                                               state?.slot?.id === slot?.id &&
                                               "bg-indigo-500 text-white"
                                           }
                                           ${
                                               slot?.past &&
                                               `bg-gray-100 text-black opacity-50 pointer-events-none`
                                           }

                                           ${
                                               mode !== "admin" &&
                                               slot?.status !== "available" &&
                                               `pointer-events-none`
                                           }
                                            
                                     `}
                                    >
                                        {slot?.time}
                                    </label>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
}
