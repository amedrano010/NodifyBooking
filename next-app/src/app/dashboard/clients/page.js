"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "/app/dashboard/context/userContext";
import Table from "./components/ui/Table";
import { TextInput, Spinner } from "flowbite-react";

import axios from "axios";

function ClientsPage() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const cells = ["name", "phone", "email"];

    const [submit, setSubmit] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Search input state+
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useUser();

    //Only fetch clients for this store
    const fetchClients = async () => {
        await axios
            .get(`${baseUrl}/clients`, {
                params: {
                    search: searchTerm,
                    company: user.selectedStore.companyId,
                },
            })
            .then((response) => {
                console.log(response);
                setClients(
                    response?.data?.map((item) => ({
                        ...item,
                        name: `${item.first} ${item.last}.`,
                    }))
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the customers!",
                    error
                );
            });
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setLoading(true);
            fetchClients().then(() => {});
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [submit]);

    return (
        <div className="card">
            <header className="flex  items-center  border-b pb-2 border-gray-200 h-12">
                <TextInput
                    className="flex-grow h-full bg-white !rounded-none "
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() => setSubmit((prev) => !prev)}
                    className="btn-secondary"
                >
                    Search
                </button>
            </header>
            <div className="h-full w-full  flex items-center justify-center">
                {loading && <Spinner />}
                {!loading && clients.length > 0 && (
                    <Table data={clients} cells={cells} tableLoaded={loading} />
                )}
                {!loading && clients.length == 0 && <div>No clients found</div>}
            </div>
        </div>
    );
}

export default ClientsPage;
