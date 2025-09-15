"use client";

import Shell from "./components/layout/Shell";
import Providers from "./context/Providers";

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children, param }) {
    return (
        <div>
            <Providers>
                <Shell>
                    {children}
                    <Toaster position="top-center" reverseOrder={false} />
                </Shell>
            </Providers>
        </div>
    );
}
