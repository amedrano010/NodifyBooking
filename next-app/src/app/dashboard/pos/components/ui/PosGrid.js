"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
    MinusCircleIcon,
    PlusCircleIcon,
    PhotoIcon,
    XCircleIcon,
} from "@heroicons/react/16/solid";

import { useUser } from "/app/dashboard/context/userContext";
import Image from "next/image";

import PosItemCard from "./posItem";

function GridTable({ view, items, setItems }) {
    const { user } = useUser;
    const [page, setPage] = useState(1);

    return (
        <div className="grid  grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 w-full  max-h-full overflow-y-auto px-1">
            {items?.map((item, i) => {
                return <PosItemCard key={i} item={item} setItems={setItems} />;
            })}
        </div>
    );
}

export default GridTable;
