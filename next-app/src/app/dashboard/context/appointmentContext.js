"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./userContext";
import axios from "axios";
import moment from "moment";

export const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
    const { user } = useUser();

    const [appointments, setAppointments] = useState([]);
    const [refreshAppointments, setRefreshAppointments] = useState(false);

    useEffect(() => {
        if (user && user.selectedStore) {
            axios
                .get(`${process.env.NEXT_PUBLIC_BASE_URL}/appointments`, {
                    params: {
                        store: user.selectedStore._id,
                        startDate: moment(new Date()).startOf("day"),
                        type: "Appointment",
                    },
                })
                .then((res) => {
                    const appointments = res.data;
                    setAppointments(appointments);
                })
                .catch((error) => {
                    console.error(
                        "There was an error fetching the appointments!",
                        error
                    );
                });
        }
    }, [refreshAppointments, user]);

    return (
        <AppointmentContext.Provider
            value={{ appointments, setAppointments, setRefreshAppointments }}
        >
            {children}
        </AppointmentContext.Provider>
    );
}

export function useAppointments() {
    return useContext(AppointmentContext);
}
