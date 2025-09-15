"use client";

import React from "react";

import { UserProvider } from "./userContext.js";
import { CartProvider } from "./cartContext.js";
import { AppointmentProvider } from "./appointmentContext.js";

function Providers({ children }) {
    return (
        <UserProvider>
            <CartProvider>
                <AppointmentProvider>{children}</AppointmentProvider>
            </CartProvider>
        </UserProvider>
    );
}

export default Providers;
