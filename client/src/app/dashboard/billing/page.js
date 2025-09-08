import React from "react";
import { Button } from "flowbite-react";

function TransactionPage(props) {
    return (
        <div className="flex h-full">
            <div className="card flex-grow overflow-hidden">
                <div className="title">Billing</div>
                <div className="flex justify-center items-center h-full">
                    <div className="btn-primary">Stripe Dashboard</div>
                </div>
            </div>
        </div>
    );
}

export default TransactionPage;
