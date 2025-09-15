import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
import { Datepicker } from "flowbite-react";
import axios from "axios";

function TimeSlot({ formData, setFormData, store }) {
    const [slots, setSlots] = useState([]);

    console.log(formData);

    //only builds slots once
    useEffect(() => {
        const minIncrement = 15;

        const currentTime = formData.date;
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
                    past: moment(current).isBefore(currentTime),
                });
                current.add(interval, "minutes");
            }
            setSlots(aSlots);
        };

        generateTimeSlots(
            moment("07:00 AM", "hh:mm A"),
            moment("8:00 PM", "hh:mm A"),
            minIncrement
        );
    }, []);

    function setBookedSlots() {
        if (!formData || !formData.date) return;

        const duration = formData.services?.reduce(
            (acc, service) => acc + service.duration,
            0
        );

        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/appointments`;

        axios
            .get(url, {
                params: {
                    start: moment(formData.date).startOf("day").toDate(),
                    end: moment(formData.date).endOf("day").toDate(),
                    store: store,
                    type: "Appointment",
                },
            })
            .then((response) => {
                const appointments = response.data.filter(
                    (item) =>
                        item.status == "Scheduled" || item.status == "Confirmed"
                );
                const currentTime = moment(new Date());

                setSlots((prevSlots) =>
                    prevSlots.map((slot) => {
                        const [hrs, min] = slot.id.split(":");
                        const slotDate = new Date(formData.date).setHours(
                            hrs,
                            min
                        );
                        const slotMoment = moment(new Date(slotDate));
                        const dSlot = slotMoment.utc();

                        const isBooked = appointments.some((appointment) => {
                            const start = moment(appointment.startDate).utc();
                            const end = moment(appointment.endDate).utc();
                            return (
                                dSlot.valueOf() >= start.valueOf() &&
                                dSlot.valueOf() < end.valueOf()
                            );
                        });

                        const isWarning = appointments.some((appointment) => {
                            const start = moment(appointment.startDate).utc();
                            const warningDate = moment(start)
                                .subtract(duration, "minutes")
                                .utc();
                            return (
                                dSlot.valueOf() >= warningDate.valueOf() &&
                                dSlot.valueOf() < start.valueOf()
                            );
                        });

                        return {
                            ...slot,
                            status: isBooked
                                ? "booked"
                                : isWarning
                                ? "warning"
                                : "available",
                            past: slotMoment.isBefore(currentTime),
                        };
                    })
                );
            })
            .catch((err) => console.error("Error fetching appointments", err));
    }
    useEffect(() => {
        setBookedSlots();
    }, [formData.date]);

    const handleDateChange = (d) => {
        setFormData((prev) => ({ ...prev, date: d, slot: {} }));
    };

    const handleTimeChange = (slot) => {
        setFormData((prev) => ({
            ...prev,
            slot: slot, // store the slot id
            startDate: slot.moment,
        }));
    };

    return (
        <div className="flex flex-col  h-full gap-4 overflow-y-hidden  w-full pb-3">
            <Datepicker
                value={formData.date}
                onChange={handleDateChange}
                minDate={new Date()}
            />

            <div className="flex flex-col gap-2 overflow-y-hidden  w-full">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-500">
                        Approx.{" "}
                        {Math.floor(
                            formData.services?.reduce(
                                (a, s) => a + s.duration,
                                0
                            ) / 60
                        )}
                        h{" "}
                        {formData.services?.reduce(
                            (a, s) => a + s.duration,
                            0
                        ) % 60}
                        m
                    </div>
                </div>

                {/* Time slots grid with scrollable container */}
                <div className="overflow-y-auto  w-full  grid grid-cols-3 gap-2 px-1 ">
                    {slots.map((slot, i) => (
                        <label
                            key={i}
                            htmlFor={slot.id}
                            className={`cursor-pointer bg-gray-50 text-gray-800  inline-flex items-center justify-center w-full px-2 py-1 text-sm font-medium border border-gray-200 rounded-md text-center
                ${slot.status == "booked" ? " bg-neutral-500 text-white" : ""}
                ${
                    formData?.slot.id == slot.id
                        ? "!bg-indigo-500 text-white"
                        : ""
                }
                ${
                    slot.past
                        ? "bg-gray-100 text-black opacity-40  pointer-events-none"
                        : ""
                }
              `}
                        >
                            <input
                                type="radio"
                                name="time"
                                id={slot.id}
                                value={slot.id}
                                className="hidden peer"
                                onChange={() => handleTimeChange(slot)}
                            />
                            {slot.time}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TimeSlot;
