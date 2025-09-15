import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Spinner,
    Dropdown,
    DropdownItem,
    DropdownDivider,
} from "flowbite-react";
import Link from "next/link.js";
import {
    PhoneIcon,
    PencilIcon,
    UserCircleIcon,
} from "@heroicons/react/16/solid";

import { Avatar } from "flowbite-react";
import { Tab } from "@headlessui/react";
import MoreMenu from "./MoreMenu.js";
import tableTheme from "/app/flowbite_themes/tableTheme.js";

export default function Component({ data }) {
    return (
        <div className="overflow-x-auto w-full  h-full  ">
            <Table striped theme={tableTheme} className="">
                <TableHead>
                    <TableRow>
                        <TableHeadCell className="pl-1"></TableHeadCell>
                        <TableHeadCell className="pl-1">Name</TableHeadCell>
                        <TableHeadCell className="pl-1">Phone</TableHeadCell>
                        <TableHeadCell className="pl-1 ">Email</TableHeadCell>
                        <TableHeadCell className="pl-1 ">Notes</TableHeadCell>
                    </TableRow>
                </TableHead>

                {true ? (
                    <TableBody className="divide-y relative">
                        {data.map((user, i) => {
                            return (
                                <TableRow
                                    key={i}
                                    className="cursor-pointer hover:bg-gray-100 border-b-gray-200"
                                    onClick={() => {
                                        // handleMorePress(user);
                                    }}
                                >
                                    <TableCell
                                        key={`action_${i}`}
                                        className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-3"
                                    >
                                        <MoreMenu clientId={user._id} />
                                    </TableCell>
                                    <TableCell
                                        key={`name_${i}`}
                                        className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-2 "
                                    >
                                        {user.first} {user.last}
                                    </TableCell>
                                    <TableCell
                                        key={`phone_${i}`}
                                        className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-1"
                                    >
                                        {user.phone}
                                    </TableCell>
                                    <TableCell
                                        key={`email_${i}`}
                                        className=" whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-1"
                                    >
                                        {user.email}
                                    </TableCell>
                                    <TableCell
                                        key={`notes_${i}`}
                                        className=" whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-1 "
                                    >
                                        {user.notes}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                ) : (
                    <></>
                )}
            </Table>
        </div>
    );
}
