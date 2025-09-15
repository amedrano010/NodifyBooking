"use client";

import { motion } from "framer-motion";
import { Button } from "flowbite-react";
import { Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";
import {
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";

export default function HomePage() {
    return (
        <main className="relative min-h-screen bg-gradient-to-b to-white from-white flex flex-col">
            <header className="sticky top-0">
                {" "}
                <Navbar className="bg-indigo-500 !text-white" fluid>
                    <NavbarBrand as={Link} href="https://flowbite-react.com">
                        <img
                            src="loop-logo.png"
                            className="mr-3 h-6 sm:h-9"
                            alt="Flowbite React Logo"
                        />
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            Loop
                        </span>
                    </NavbarBrand>
                    <NavbarToggle />
                    <NavbarCollapse>
                        <NavbarLink href="#">Home</NavbarLink>
                        <NavbarLink as={Link} href="#features">
                            Features
                        </NavbarLink>
                        <NavbarLink href="#pricing">Pricing</NavbarLink>
                        <NavbarLink href="/login" as={Link}>
                            Login
                        </NavbarLink>
                    </NavbarCollapse>
                </Navbar>
            </header>
            {/* Hero */}
            <section className="flex flex-col items-center text-center px-6 py-20 md:py-32">
                <motion.h1
                    className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Stay in the <span className="text-indigo-600">Loop</span>
                </motion.h1>
                <motion.p
                    className="mt-6 text-lg text-gray-600 max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Loop keeps your business running 24/7. Manage client
                    appointments, store events, and team schedules—all in one
                    place.
                </motion.p>
                <motion.div
                    className="mt-8 flex gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link
                        href={`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`}
                        size="lg"
                        className="btn-secondary"
                    >
                        Go to dashboard
                    </Link>
                </motion.div>
            </section>

            {/* Features */}
            <section id="features" className="px-6 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
                    <div className="rounded-2xl shadow-md hover:shadow-lg transition">
                        <div className="p-6 flex flex-col items-center text-center">
                            <Calendar className="h-10 w-10 text-indigo-600 mb-4" />
                            <h3 className="font-semibold text-lg">
                                Smart Scheduling
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Book appointments, events, and manage blackout
                                dates seamlessly.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl shadow-md hover:shadow-lg transition">
                        <div className="p-6 flex flex-col items-center text-center">
                            <Clock className="h-10 w-10 text-indigo-600 mb-4" />
                            <h3 className="font-semibold text-lg">
                                24/7 Access
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Stay in the loop of your business anytime,
                                anywhere.
                            </p>
                        </div>
                    </div>
                    <div className="rounded-2xl shadow-md hover:shadow-lg transition">
                        <div className="p-6 flex flex-col items-center text-center">
                            <Users className="h-10 w-10 text-indigo-600 mb-4" />
                            <h3 className="font-semibold text-lg">
                                Team Friendly
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Give staff their own access to manage schedules
                                and services.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo / Screenshot */}
            <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold">See Loop in Action</h2>
                    <p className="mt-3 text-gray-600">
                        A modern booking platform designed to grow with your
                        business.
                    </p>
                    <div className="mt-10 rounded-2xl shadow-xl overflow-hidden border">
                        {/* Replace with actual screenshot or app preview */}
                        <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500">
                            App Screenshot / Demo Here
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="px-6 py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold">
                        Simple, transparent pricing
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Choose the plan that works best for your business.
                    </p>

                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {/* Starter */}
                        <div className="rounded-2xl shadow-md hover:shadow-lg transition">
                            <div>
                                <div className="text-xl font-semibold">
                                    Starter
                                </div>
                            </div>
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="text-4xl font-bold text-gray-900">
                                    $19
                                </div>
                                <p className="text-gray-500">per month</p>
                                <ul className="mt-6 space-y-2 text-gray-600">
                                    <li>✔ 1 Staff Account</li>
                                    <li>✔ Unlimited Appointments</li>
                                    <li>✔ Email Reminders</li>
                                </ul>
                                <Button className="mt-8 w-full rounded-2xl">
                                    Choose
                                </Button>
                            </div>
                        </div>

                        {/* Pro */}
                        <div className="rounded-2xl border-2 border-indigo-600 shadow-lg">
                            <div>
                                <div className="text-xl font-semibold text-indigo-600">
                                    Pro
                                </div>
                            </div>
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="text-4xl font-bold text-gray-900">
                                    $49
                                </div>
                                <p className="text-gray-500">per month</p>
                                <ul className="mt-6 space-y-2 text-gray-600">
                                    <li>✔ Up to 5 Staff Accounts</li>
                                    <li>✔ Unlimited Appointments</li>
                                    <li>✔ Text & Email Reminders</li>
                                    <li>✔ Custom Branding</li>
                                </ul>
                                <Button className="mt-8 w-full rounded-2xl bg-indigo-600 text-white">
                                    Choose
                                </Button>
                            </div>
                        </div>

                        {/* Enterprise */}
                        <div className="rounded-2xl shadow-md hover:shadow-lg transition">
                            <div>
                                <div className="text-xl font-semibold">
                                    Enterprise
                                </div>
                            </div>
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="text-4xl font-bold text-gray-900">
                                    Custom
                                </div>
                                <p className="text-gray-500">
                                    tailored pricing
                                </p>
                                <ul className="mt-6 space-y-2 text-gray-600">
                                    <li>✔ Unlimited Staff Accounts</li>
                                    <li>✔ Premium Support</li>
                                    <li>✔ API Access</li>
                                    <li>✔ Advanced Analytics</li>
                                </ul>
                                <Button className="mt-8 w-full rounded-2xl">
                                    Contact Us
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <footer className="bg-indigo-600 text-white py-12 px-6 mt-auto">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <h3 className="text-2xl font-semibold">
                        Ready to stay in the Loop?
                    </h3>
                    <Button
                        size="lg"
                        className="bg-white text-indigo-600 rounded-2xl"
                    >
                        Start Free Trial
                    </Button>
                </div>
            </footer>
        </main>
    );
}
