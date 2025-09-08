"use client";

import React from "react";

import { UserProvider } from "../context/userContext.js";
import { CartProvider } from "../context/cartContext.js";

function Providers({ children }) {
    return (
        <UserProvider>
            <CartProvider>{children}</CartProvider>
        </UserProvider>
    );
}

export default Providers;
