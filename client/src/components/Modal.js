"use client";
import React from "react";
import Draggable from "react-draggable";

/**
 * Reusable Modal Component
 * @param {boolean} open - Whether the modal is open
 * @param {function} setOpen - Function to close the modal
 * @param {string} [title] - Optional modal title
 * @param {React.ReactNode} children - Modal content
 */
const Modal = ({ open, setOpen, title, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center !bg-gray-500/50">
            <div className="  bg-white rounded-none sm:rounded-lg shadow-lg w-full h-full max-h-screen sm:max-w-lg sm:h-auto sm:max-h-[90vh] p-4 sm:p-8 relative flex flex-col overflow-y-auto">
                <div className="flex justify-between items-center mb-5 border-b pb-3 border-gray-300 sticky top-0 bg-white z-10">
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                    {title && (
                        <h2 className="text-xl font-semibold ">{title}</h2>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
