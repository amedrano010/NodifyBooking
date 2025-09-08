import React from "react";

function layout({ children }) {
    return (
        <div className="flex flex-col h-full max-h-full">
            <div className="card flex flex-col h-full lg:h-full gap-2 overflow-y-hidden p-4">
                {children}
            </div>
        </div>
    );
}

export default layout;
