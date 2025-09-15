"use client";

import React from "react";

function Button({ icon, text, onClick, classes }) {
    return (
        <div
            className={`rounded-xs border cursor-pointer border-gray-200 flex  items-center gap-1 py-1 px-2 ${classes}`}
            onClick={() => onClick()}
        >
            {icon}
            <p className="text-lg">{text}</p>
        </div>
    );
}

export default Button;
