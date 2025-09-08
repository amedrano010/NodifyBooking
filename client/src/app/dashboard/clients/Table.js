import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Spinner,
} from "flowbite-react";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { Avatar } from "flowbite-react";
import { Tab } from "@headlessui/react";

export default function Component({
    headers,
    cells,
    data,
    handleMorePress,
    tableLoaded,
}) {
    const tableTheme = {
        root: {
            base: "list-inside space-y-1 text-gray-500 dark:text-gray-400 ",
            ordered: {
                off: "list-disc",
                on: "list-decimal",
            },
            horizontal:
                "flex list-none flex-wrap items-center justify-center space-x-4 space-y-0",
            unstyled: "list-none",
            nested: "mt-2 ps-5",
        },
        item: {
            withIcon: {
                off: "",
                on: "flex items-center",
            },
            icon: "me-2 h-3.5 w-3.5 flex-shrink-0",
        },
    };
    const avatarTheme = {
        root: {
            base: "flex items-center justify-start space-x-4 rounded ",
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
                lg: "h-20 w-20",
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

    return (
        <div className="overflow-x-auto   h-full  ">
            <Table striped theme={tableTheme} className="">
                <TableHead>
                    <TableRow>
                        <TableHeadCell className="pl-1">Name</TableHeadCell>
                        <TableHeadCell className="pl-1">Phone</TableHeadCell>

                        <TableHeadCell className="pl-1"></TableHeadCell>
                    </TableRow>
                </TableHead>

                {true ? (
                    <TableBody className="divide-y relative">
                        {data.map((user, i) => {
                            return (
                                <TableRow
                                    key={i}
                                    className="cursor-pointer hover:bg-gray-100 "
                                    onClick={() => {
                                        handleMorePress(user);
                                    }}
                                >
                                    <TableCell
                                        key={`name${i}`}
                                        className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-2 "
                                    >
                                        {user.name} {user.last}
                                    </TableCell>
                                    <TableCell
                                        key={`name${i}`}
                                        className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-1"
                                    >
                                        {user.phone}
                                    </TableCell>

                                    <TableCell
                                        key={`name${i}`}
                                        className="whitespace-nowrap text-sm lg:text-base text-gray-700 dark:text-white px-1"
                                    >
                                        <EllipsisHorizontalIcon className="h-5 w-5" />
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
