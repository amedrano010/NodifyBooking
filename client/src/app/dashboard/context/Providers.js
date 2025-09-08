"use client";

import React from "react";

import { UserProvider } from "./userContext.js";
import { CartProvider } from "./cartContext.js";

function Providers({ children }) {
    return (
        <UserProvider>
            <CartProvider>{children}</CartProvider>
        </UserProvider>
    );
}

export default Providers;
