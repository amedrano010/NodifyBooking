"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Button } from "flowbite-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
            .min(6, "Password too short")
            .required("Required"),
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Replace with your login API
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Login failed");
            } else {
                toast.success("Login successful!");
                // Redirect or update user context
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    Welcome Back
                </h1>
                <p className="text-center text-gray-500 mt-2">
                    Login to access your Loop account
                </p>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="you@example.com"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Field
                                    type="password"
                                    name="password"
                                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="********"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-500 text-white rounded-sm py-2 mt-4"
                                disabled={loading || isSubmitting}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>

                            <div className="text-center mt-4 text-gray-500 text-sm">
                                Don’t have an account?{" "}
                                <a
                                    href="/signup"
                                    className="text-indigo-500 hover:underline font-medium"
                                >
                                    Sign up
                                </a>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
