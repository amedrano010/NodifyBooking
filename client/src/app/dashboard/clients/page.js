"use client";
import React, { useState, useEffect, useContext } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Table from "./Table";
import Modal from "../../../components/ui/Modal";
import CustomerForm from "../forms/CustomerForm";
import axios from "axios";
import { List } from "flowbite-react";
import { useUser } from "../../context/userContext";

function Customers() {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const { user } = useUser();

    const [searchTerm, setSearchTerm] = useState(""); // Search input state+
    const [modal, setModal] = useState(false);
    const [cells] = useState(["name", "phone", "email"]);
    const [data, setData] = useState([
        {
            name: "Abram",
            last: "Medrano",
            phone: "2616584146",
            email: "abrmmedrano10@gmail.com",
            visits: 20,
            history: [
                {
                    services: [],
                    cost: 800,
                    status: "Scheduled",
                    date: new Date(),
                },
                {
                    services: [],
                    cost: 800,
                    status: "Cancelled",
                    date: new Date(),
                },
                {
                    services: [],
                    cost: 800,
                    status: "Completed",
                    date: new Date(),
                },
                {
                    services: [],
                    cost: 800,
                    status: "Completed",
                    date: new Date(),
                },
            ],
        },
    ]);
    const [tableLoaded, setTableLoaded] = useState(false);

    const filteredData = data.filter((user) => {
        if (searchTerm) {
            let match = false;

            for (const prop in user) {
                if (
                    user[prop]
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                ) {
                    match = true;
                }
            }

            return match;
        } else {
            return true;
        }
    });

    console.log(filteredData);

    //Form
    const [formType, setFormType] = useState("New");
    const [formData, setFormData] = useState({
        _id: "",
        first: "",
        last: "",
        email: "",
        phone: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate inputs
    const validate = () => {
        let newErrors = {};
        if (!formData.first) newErrors.first = "Required";
        if (!formData.last) newErrors.last = "Required";

        if (!formData.email.includes("@"))
            newErrors.email = "Valid email required";

        return newErrors;
    };

    const fetchCustomers = async () => {
        await axios
            .get(`${baseUrl}/customers`)
            .then((response) => {
                setData(
                    response.data.map((item) => ({
                        ...item.customer,
                        name: `${item.customer.first} ${item.customer.last[0]}.`,
                    }))
                );
                setTableLoaded(true);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the customers!",
                    error
                );
            });
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Handle form submission
    const handleSubmit = (e, id) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            //if new, add to array
            if (formType === "New") {
                axios
                    .post(`${baseUrl}/customers`, {
                        ...formData,
                    })
                    .then((res) => {
                        fetchCustomers(); // Refresh the customer table
                        setFormData({
                            _id: "",
                            first: "",
                            last: "",
                            email: "",
                            phone: "",
                            notes: "",
                        }); // Reset form
                        setErrors({});
                        setModal(false);
                    })
                    .catch((error) => {
                        if (
                            error.response.data.message ===
                            "Email already exists"
                        ) {
                            console.log("Email already exist");
                            return;
                        }
                    });
            } else if (formType === "Edit") {
                //if edit, update object
                axios
                    .put(`${baseUrl}/customers/${formData._id}`, formData)
                    .then((response) => {
                        fetchCustomers(); // Refresh the customer table
                        setFormData({
                            _id: "",
                            first: "",
                            last: "",
                            email: "",
                            phone: "",
                            notes: "",
                        }); // Reset form
                        setErrors({});
                        setModal(false);
                    })
                    .catch((error) => {
                        console.error(
                            "There was an error updating the customer!",
                            error
                        );
                    });
            }
        }
    };

    const handleDelete = () => {
        axios
            .delete(`${baseUrl}/customers/${formData._id}`, formData)
            .then((response) => {
                fetchCustomers(); // Refresh the customer table
                setFormData({
                    _id: "",
                    first: "",
                    last: "",
                    email: "",
                    phone: "",
                    notes: "",
                }); // Reset form
                setErrors({});
                setModal(false);
            })
            .catch((error) => {
                console.error(
                    "There was an error deleting the customer!",
                    error
                );
            });
    };

    const handleMorePress = (user) => {
        setFormData(user);
        setModal(true);
        setFormType("Read");
    };

    return (
        <div className="flex flex-col h-full max-h-full">
            <div className="card flex flex-col h-full lg:h-full gap-2 overflow-y-hidden">
                <div className="title">Clients</div>
                <nav className="flex items-center gap-2 border-b pb-2 border-gray-200 h-12">
                    <input
                        className="border border-slate-300 flex-grow h-full bg-white"
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </nav>
                <div className="h-full ">
                    <Table
                        data={filteredData}
                        cells={cells}
                        handleMorePress={handleMorePress}
                        tableLoaded={tableLoaded}
                    />
                </div>
            </div>

            <CustomerForm
                formType={formType}
                formData={formData}
                setFormData={setFormData}
                handleChange={(e) => handleChange(e)}
                errors={errors}
                openModal={modal}
                setOpenModal={setModal}
                handleSubmit={handleSubmit}
                setFormType={setFormType}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default Customers;
