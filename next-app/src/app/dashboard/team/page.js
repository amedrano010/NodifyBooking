"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "/app/dashboard/context/userContext";
import Table from "./components/ui/EmployeeTable";
import { TextInput, Spinner } from "flowbite-react";

import axios from "axios";

function StaffPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [submit, setSubmit] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Search input state+
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useUser();

    //Only fetch employees for this store
    const fetchEmployees = async () => {
        await axios
            .get(`${baseUrl}/employees`, {
                params: {
                    search: searchTerm,
                    store: user.selectedStore._id,
                },
            })
            .then((response) => {
                const data = response.data;
                setEmployees(
                    data?.map((item) => ({
                        ...item,
                    }))
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the employees!",
                    error
                );
            });
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setLoading(true);
            fetchEmployees().then(() => {});
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [submit]);

    console.log(employees);

    return (
        <div className="card">
            <header className="flex  items-center  pb-2  h-12">
                <TextInput
                    className="flex-grow h-full bg-white !rounded-none  "
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={(e) => setSubmit((prev) => !prev)}
                    className="btn-secondary"
                >
                    Search
                </button>
            </header>
            <div className="h-full w-full  flex items-center justify-center">
                {loading && <Spinner />}
                {!loading && employees.length > 0 && (
                    <Table data={employees} tableLoaded={loading} />
                )}
                {!loading && employees.length == 0 && (
                    <div>No employees found</div>
                )}
            </div>
        </div>
    );
}

export default StaffPage;
