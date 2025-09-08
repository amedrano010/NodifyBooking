import React from "react";
import Link from "next/link";

function page(props) {
    return (
        <section className="gap-5 flex flex-grow text-center flex-col items-center justify-center h-screen w-full p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
            <h2 className="text-xl">
                Smarter Scheduling for Salons & Service Businesses
            </h2>
            <p className="">
                Manage appointments by easy to use time slots, reduce no-shows,
                and let clients book online — anytime.
            </p>
            <Link className="btn-primary" href="/dashboard">
                Go to dashboard
            </Link>
        </section>
    );
}

export default page;
