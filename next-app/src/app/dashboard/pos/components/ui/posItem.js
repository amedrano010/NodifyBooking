import React from "react";
import Image from "next/image";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";
/**
 * Minimal POS Item Card (React + Tailwind)
 * - Single-file component ready to drop into a Next.js / React app
 * - Uses Tailwind utility classes (assumes Tailwind is configured)
 * - Accessible, responsive, and minimal UI for a point-of-sale item
 *
 * Props:
 *  - item: { id, name, price, image, sku, badge, inStock }
 *
 */

export default function PosItemCard({ item, setItems }) {
    /*
    const item = {
        id: "1",
        name: "Classic Pomade",
        price: 14.5,
        image: "https://via.placeholder.com/320x240.png?text=Product",
        sku: "POM-001",
        badge: "Best Seller",
        inStock: true,
    };

    */

    function formatMoney(n) {
        // simple, locale-aware formatting
        return n.toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
        });
    }

    function increment(id) {
        setItems((prev) => {
            return prev.map((service) => {
                return service._id == id
                    ? { ...service, quantity: Math.min(99, item.quantity + 1) }
                    : service;
            });
        });
    }

    function decrement(id) {
        setItems((prev) => {
            return prev.map((service) => {
                return service._id == id
                    ? { ...service, quantity: Math.min(99, item.quantity - 1) }
                    : service;
            });
        });
    }

    function handleQuantityChange(e, id) {
        setItems((prev) => {
            return prev.map((service) => {
                return service._id == id
                    ? { ...service, quantity: e.target.value }
                    : service;
            });
        });
    }

    return (
        <article
            className={`${
                item.quantity > 0
                    ? "border-indigo-500 border-2"
                    : "border-gray-300 "
            } w-full max-w-xs bg-neutral-100 border  rounded-md shadow-sm p-3 flex flex-col gap-3 transition-transform `}
            aria-labelledby={`item-${item.id}-name`}
        >
            <div className="relative overflow-hidden border border-slate-300 rounded-lg">
                <div className="aspect-[4/3] w-full rounded-md overflow-hidden bg-slate-50  ">
                    <Image
                        width={300}
                        height={300}
                        src={item.images[0]}
                        alt={item.name}
                        className="object-cover w-full h-full"
                    />
                </div>

                {item.badge && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/90  backdrop-blur border border-slate-100 ">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden
                        >
                            <path d="M9.049 2.927C9.469 1.79 10.531 1.79 10.951 2.927l.7 2.172a1 1 0 00.95.69h2.28c1.14 0 1.61 1.46.69 2.11l-1.85 1.39a1 1 0 00-.36 1.11l.7 2.17c.42 1.136-.89 2.02-1.8 1.36l-1.85-1.39a1 1 0 00-1.17 0l-1.85 1.39c-.91.66-2.22-.22-1.8-1.36l.7-2.17a1 1 0 00-.36-1.11L2.63 8.9c-.92-.65-.45-2.11.69-2.11h2.28a1 1 0 00.95-.69l.7-2.17z" />
                        </svg>
                        <span className="truncate">{item.badge}</span>
                    </span>
                )}

                {!item.inStock && (
                    <span className="hidden absolute bottom-3 left-3 text-xs px-2 py-1 rounded-md bg-rose-50  text-rose-700  border border-rose-100 ">
                        Out of stock
                    </span>
                )}
            </div>

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3
                        id={`item-${item.id}-name`}
                        className="text-sm font-semibold text-slate-900 truncate"
                    >
                        {item.name}
                    </h3>
                    <p className="hidden mt-1 text-xs text-slate-500 ">
                        SKU: {item.description} test
                    </p>
                </div>

                <p className="text-sm font-medium text-slate-900 ">
                    {formatMoney(item.price)}
                </p>
            </div>

            <div className="flex  w-fit items-center gap-3  border border-gray-300 rounded-md overflow-hidden">
                {/* Quantity stepper */}
                <div className="inline-flex items-center  justify-center   bg-white text-black">
                    <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => decrement(item._id)}
                        className="px-3 py-2 text-sm hover:bg-slate-100  disabled:opacity-40"
                        disabled={item.quantity < 1}
                    >
                        <MinusIcon className="h-4" />
                    </button>
                    <input
                        type="number"
                        className="tpx-0 text-sm min-w-[36px] ! !pl-0 text-center w-2 !border-none"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(e, item._id)}
                    />

                    <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => increment(item._id)}
                        className="px-3 py-2 text-sm hover:bg-slate-100  disabled:opacity-40"
                        //disabled={!item.inStock}
                    >
                        <PlusIcon className="h-4" />
                    </button>
                </div>
            </div>

            <div className=" mt-2 text-xs text-slate-400 ">
                {/* small helper row */}
                <span className="hidden">
                    {item.inStock ? "Available" : "Unavailable"}
                </span>
                <span className="mx-2 hidden">•</span>
                <span>{formatMoney(item.price * item.quantity)} total</span>
            </div>
        </article>
    );
}
