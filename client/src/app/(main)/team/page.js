"use client";

import React, { useState, useEffect, useContext } from "react";
import {
    PlusCircleIcon,
    PhoneIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { Avatar, List, ListItem, Table, Checkbox } from "flowbite-react";
import TeamForm from "../forms/TeamForm";
import axios from "axios";
import { useUser } from "../../dashboard/context/userContext";

function Team(props) {
    const avatarTheme = {
        root: {
            base: "flex items-center justify-center space-x-4 rounded",
            bordered: "p-1 ring-2",
            rounded: "rounded-full",
            color: {
                dark: "ring-gray-800 dark:ring-gray-800",
                failure: "ring-red-500 dark:ring-red-700",
                gray: "ring-gray-500 dark:ring-gray-400",
                info: "ring-cyan-400 dark:ring-cyan-800",
                light: "ring-gray-300 dark:ring-gray-500",
                purple: "ring-purple-500 dark:ring-purple-600",
                success: "ring-green-500 dark:ring-green-500",
                warning: "ring-yellow-300 dark:ring-yellow-500",
                pink: "ring-pink-500 dark:ring-pink-500",
            },
            img: {
                base: "rounded object-cover",
                off: "relative overflow-hidden bg-gray-100 dark:bg-gray-600",
                on: "",
                placeholder: "absolute -bottom-1 h-auto w-auto text-gray-400",
            },
            size: {
                xs: "h-6 w-6",
                sm: "h-8 w-8",
                md: "h-10 w-10",
                lg: "h-14 w-14",
                xl: "h-36 w-36",
            },
            stacked: "ring-2 ring-gray-300 dark:ring-gray-500",
            statusPosition: {
                "bottom-left": "-bottom-1 -left-1",
                "bottom-center": "-bottom-1",
                "bottom-right": "-bottom-1 -right-1",
                "top-left": "-left-1 -top-1",
                "top-center": "-top-1",
                "top-right": "-right-1 -top-1",
                "center-right": "-right-1",
                center: "",
                "center-left": "-left-1",
            },
            status: {
                away: "bg-yellow-400",
                base: "absolute h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800",
                busy: "bg-red-400",
                offline: "bg-gray-400",
                online: "bg-green-400",
            },
            initials: {
                text: "font-medium text-gray-600 dark:text-gray-300",
                base: "relative inline-flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-600",
            },
        },
        group: {
            base: "flex -space-x-4",
        },
        groupCounter: {
            base: "relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-white ring-2 ring-gray-300 hover:bg-gray-600 dark:ring-gray-500",
        },
    };

    const { user, setUpdateUser } = useUser();
    const [searchTerm, setSearchTerm] = useState(""); // Search input state+
    const [modal, setModal] = useState(false);
    const [team, setTeam] = useState([
        {
            _id: 1,
            first: "Abram",
            last: "medrano",
            role: "Owner",
            email: "abram@nodifyapps.io",
            profile_picture:
                "https://images.pexels.com/photos/800330/pexels-photo-800330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            services: [
                {
                    title: "haircut",
                    description: "No fades here",
                    cost: "$30",
                },
            ],
        },
    ]);
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [services, setServices] = useState([]);
    const [updateServices, setUpdateServices] = useState(false);
    const [refreshServices, setRefreshServices] = useState(false);

    //Get Users for store
    useEffect(() => {
        if (user && user._id) {
            const storeId = user.selectedStore;

            axios
                .get("employees", {
                    params: {
                        store: storeId,
                    },
                })
                .then((res) => {
                    const employees = res.data.map((employee) => {
                        return {
                            role: employee.role,
                            ...employee.employee,
                            services: employee.services,
                        };
                    });

                    setTeam(employees);
                });
        }
    }, [user, selectedUser]);

    //Load company services
    useEffect(() => {
        if (user && user._id) {
            const oStore = user?.stores?.find(
                (item) => item.store._id === user.selectedStore
            );

            axios
                .get("services", {
                    params: {
                        company: oStore?.store?.company,
                    },
                })
                .then((res) => {
                    const resData = res.data.map((item) => ({
                        ...item.service,
                        checked: false,
                    }));

                    setServices(resData);
                });
        }
    }, [user]);

    //check true selected user services
    useEffect(() => {
        if (selectedUser && selectedUser._id) {
            const userServices = selectedUser.services;

            setServices((prevServices) => {
                const arrUpdated = [];
                prevServices.forEach((oService) => {
                    oService.checked = false;
                    userServices.forEach((userService) => {
                        if (oService._id === userService._id) {
                            oService.checked = true;
                        }
                    });

                    arrUpdated.push(oService);
                });

                return arrUpdated;
            });
        }
    }, [selectedUser]);

    const filteredData = team.filter((user) => {
        let isSearch = false;
        if (searchTerm === "") {
            return true;
        } else {
            if (user.first.toLowerCase().includes(searchTerm.toLowerCase())) {
                isSearch = true;
            }
            if (user.last.toLowerCase().includes(searchTerm.toLowerCase())) {
                isSearch = true;
            }
            if (user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
                isSearch = true;
            }
            if (user.phone?.toLowerCase().includes(searchTerm.toLowerCase())) {
                isSearch = true;
            }
        }

        return isSearch;
    });

    //Form
    const [formType, setFormType] = useState("New");

    const handleEdit = (user) => {
        setModal(true);
        setFormType("Edit");
    };

    const handleUserSelect = (selectedUser) => {
        setPage(2);
        setSelectedUser(selectedUser);
    };

    const handleBackClick = () => {
        setPage(1);
        setSelectedUser({});
        setServices((prev) => {
            return prev.map((item) => ({ ...item, checked: false }));
        });
    };

    const handleCheckboxChange = (serviceId) => {
        //Update user services

        setServices((prevServices) => {
            const updatedServices = prevServices.map((item) =>
                item._id === serviceId
                    ? { ...item, checked: !item.checked }
                    : item
            );

            // Update user services in the database
            const selected = updatedServices
                .filter((item) => item.checked)
                .map((item) => item._id);

            axios
                .post("employees", {
                    user: selectedUser._id,
                    store: user.selectedStore,
                    services: selected,
                })
                .then((res) => {
                    //   console.log("User services updated:", res.data);
                })
                .catch((error) => {
                    console.error("Error updating user services:", error);
                });

            setUpdateUser((prev) => !prev);

            return updatedServices;
        });
    };

    return (
        <div className="h-full flex-col flex">
            <div className="card flex flex-col flex-grow  gap-2 ">
                <div className="title">Team</div>
                {page === 1 && (
                    <div className="transition-opacity duration-1000 opacity-100">
                        <nav className="flex items-center gap-2 border-b pb-2 border-gray-200 h-12">
                            <input
                                className="ml-2 border  border-slate-300 w-full h-full"
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <div
                                className="px-4 py-2 w-fit h-full bg-rose-400 shadow-md text-white rounded-sm  justify-center items-center gap-1 cursor-pointer"
                                onClick={() => {
                                    setModal(true);
                                    setFormType("New");
                                }}
                            >
                                <PlusCircleIcon className="h-6" />
                            </div>
                        </nav>
                        <div className="flex-grow mt-3">
                            <List
                                unstyled
                                className="divide-y divide-gray-200 dark:divide-gray-700"
                            >
                                {filteredData.map((user, i) => (
                                    <ListItem
                                        key={user._id}
                                        className="py-3 px-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            handleUserSelect(user);
                                        }}
                                    >
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <Avatar
                                                theme={avatarTheme}
                                                img={user.profile_picture}
                                                alt="profile picture for team member object-cover"
                                                rounded
                                                size="lg"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.first} {user.last}
                                                </p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                                <p className="truncate text-sm text-gray-500 dark:text-gray-400 ">
                                                    {user.role}
                                                </p>
                                            </div>

                                            <EnvelopeIcon
                                                onClick={() => {}}
                                                className="h-5"
                                            />
                                            <PhoneIcon className="h-5" />
                                        </div>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </div>
                )}
                {page === 2 && (
                    <div className="transition-opacity duration-1000 opacity-100 flex flex-col flex-grow">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <Avatar
                                theme={avatarTheme}
                                img={selectedUser.profile_picture}
                                alt="profile picture for team member object-cover"
                                rounded
                                size="lg"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {selectedUser.first} {selectedUser.last}
                                </p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                    {selectedUser.email}
                                </p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400 ">
                                    {selectedUser.role}
                                </p>
                            </div>

                            <EnvelopeIcon onClick={() => {}} className="h-5" />
                            <PhoneIcon className="h-5" />
                        </div>

                        <div className="mt-4 flex-grow overflow-y-hidden">
                            <div>Services</div>
                            <div className="overflow-x-auto mt-2 h-full">
                                <Table hoverable striped>
                                    <Table.Head>
                                        <Table.HeadCell className="p-4">
                                            <Checkbox />
                                        </Table.HeadCell>
                                        <Table.HeadCell>Service</Table.HeadCell>
                                        <Table.HeadCell>
                                            Description
                                        </Table.HeadCell>
                                        <Table.HeadCell>Price</Table.HeadCell>
                                        <Table.HeadCell>
                                            Duration
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {services?.map((service, i) => (
                                            <Table.Row
                                                key={i}
                                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                            >
                                                <Table.Cell className="p-4">
                                                    <Checkbox
                                                        checked={
                                                            service.checked
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                service._id
                                                            )
                                                        }
                                                    />
                                                </Table.Cell>
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {service.name}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {service.description
                                                        ? service.description
                                                        : "-"}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    ${service.price}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {service.duration} min
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        </div>
                        <div className="">
                            <div
                                onClick={handleBackClick}
                                className="w-1/2 bg-gray-400 py-2 px-4 rounded-sm text-white text-center"
                            >
                                Back
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <TeamForm
                formType={formType}
                openModal={modal}
                setOpenModal={setModal}
            />
        </div>
    );
}

export default Team;
