import React from "react";
import { Button } from "flowbite-react";

function TransactionPage(props) {
    return (
        <div className="">
            <div className="h-fit pb-2 text-2xl font-semibold">Dashboard</div>
            <div className="card">
                <Button className="bg-indigo-600">
                    Go to Stripe Dashboard
                </Button>
            </div>
        </div>
    );
}

export default TransactionPage;
