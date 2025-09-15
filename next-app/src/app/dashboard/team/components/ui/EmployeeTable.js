import { Avatar, List, ListItem } from "flowbite-react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Component({ data }) {
    const router = useRouter();

    console.log(data);

    return (
        <div className="overflow-x-auto w-full  h-full  ">
            <List unstyled className="divide-y divide-gray-200 w-full ">
                {data.map((obj, i) => (
                    <ListItem
                        key={i}
                        className="p-4 cursor-pointer hover:bg-gray-50 w-full"
                        onClick={() => {
                            router.push(`/dashboard/team/${obj.employee._id}`);
                        }}
                    >
                        <div className="flex items-center space-x-4 rtl:space-x-reverse ">
                            {!obj.employee?.profile_image ? (
                                <>
                                    <Avatar
                                        img="https://images.pexels.com/photos/800330/pexels-photo-800330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                        alt="Neil image"
                                        rounded
                                        size="lg"
                                    />
                                </>
                            ) : (
                                <>
                                    <UserCircleIcon className="h-10 w-10" />
                                </>
                            )}

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {obj.employee?.first} {obj.employee?.last}
                                </p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                    {obj.employee?.phone}
                                </p>
                                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                    {obj.employee?.email}
                                </p>
                            </div>
                        </div>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
