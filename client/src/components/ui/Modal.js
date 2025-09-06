import React, { useState } from "react";

function Modal({
    isOpen,
    setModal,
    children,
    className,
    style,
    buttons,
    onClose,
}) {
    return (
        <>
            <div
                className={`overlay ${
                    isOpen ? "" : "hidden"
                } max-h-screen max-w-screen`}
            ></div>

            <div
                className={`${
                    isOpen ? " " : "hidden"
                } modal bg-white rounded-lg w-5/6 h-5/6 max-h-5/6 lg:h-fit lg:w-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg ${className} overflow-hidden  `}
                style={style}
            >
                <div className="p-4 flex-grow overflow-y-auto pb-16 max-h-full">
                    {children}
                </div>

                <footer className="flex w-full h-12  bg-slate-600 rounded-b-lg px-4 justify-between text-white absolute bottom-0 ">
                    <button
                        onClick={(e) => {
                            setModal(false);
                            onClose();
                        }}
                    >
                        Close
                    </button>
                    {buttons}
                </footer>
            </div>
        </>
    );
}

export default Modal;
