"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "flowbite-react";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);

    const initialValues = {
        companyName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        accountType: "basic", // basic, pro, enterprise
    };

    const validationSchema = Yup.object({
        companyName: Yup.string().required("Required"),
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string()
            .min(6, "Password too short")
            .required("Required"),
        accountType: Yup.string().oneOf(["basic", "pro", "enterprise"]),
    });

    const handleSubmit = async (values) => {
        setLoading(true);

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/signup`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    company: values.companyName,
                    first: values.firstName,
                    last: values.lastName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Signup failed");
            } else {
                toast.success(
                    "Account created! Redirecting to Stripe onboarding..."
                );
                // Redirect user to Stripe Express onboarding
                window.location.href = data.onboardingUrl;
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
            <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    Create Your Loop Account
                </h1>
                <p className="text-center text-gray-500 mt-2">
                    Sign up and start managing your business 24/7
                </p>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="mt-6 space-y-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Your Business Name
                                </label>
                                <Field
                                    type="text"
                                    name="companyName"
                                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <ErrorMessage
                                    name="companyName"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="firstName"
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="firstName"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="lastName"
                                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="lastName"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                            </div>

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

                            {/* Account type selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Type
                                </label>
                                <div className="flex gap-4">
                                    {["basic", "pro", "enterprise"].map(
                                        (type) => (
                                            <div
                                                key={type}
                                                onClick={() =>
                                                    setFieldValue(
                                                        "accountType",
                                                        type
                                                    )
                                                }
                                                className={`cursor-pointer px-4 py-2 border rounded-xl flex-1 text-center transition
                        ${
                            values.accountType === type
                                ? "border-indigo-600 bg-indigo-50 text-indigo-500"
                                : "border-gray-300 text-gray-700"
                        }
                      `}
                                            >
                                                {type.charAt(0).toUpperCase() +
                                                    type.slice(1)}
                                            </div>
                                        )
                                    )}
                                </div>
                                <ErrorMessage
                                    name="accountType"
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-500 text-white rounded-sm py-2 mt-4"
                                disabled={loading || isSubmitting}
                            >
                                {loading ? "Creating account..." : "Sign Up"}
                            </Button>

                            <div className="text-center mt-4 text-gray-500 text-sm">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="text-indigo-600 hover:underline font-medium"
                                >
                                    Login
                                </a>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
