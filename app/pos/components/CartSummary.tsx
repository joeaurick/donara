"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import PaymentModal from "./PaymentModal";

export default function CartSummary() {
  const {
    cart,
    subtotal,
    discount,
    tax,
    total,
  } = useCart();

  const [openPayment, setOpenPayment] = useState(false);

  const totalItem = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <>
      <div className="border-t bg-white">

        <div className="space-y-1 px-4 py-3 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Item
            </span>

            <span className="font-semibold">
              {totalItem}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span>
              Rp {subtotal.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Diskon
            </span>

            <span>
              Rp {discount.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Pajak
            </span>

            <span>
              Rp {tax.toLocaleString("id-ID")}
            </span>
          </div>

        </div>

        <div className="border-t px-4 py-3">

          <div className="mb-3 flex items-center justify-between">

            <span className="text-base font-bold">
              TOTAL
            </span>

            <span className="text-xl font-black text-pink-600">
              Rp {total.toLocaleString("id-ID")}
            </span>

          </div>

          <button
            onClick={() => setOpenPayment(true)}
            disabled={cart.length === 0}
            className="w-full rounded-xl bg-pink-600 py-2.5 font-bold text-white hover:bg-pink-700 disabled:bg-gray-300"
          >
            Bayar Rp {total.toLocaleString("id-ID")}
          </button>

        </div>

      </div>

      <PaymentModal
        open={openPayment}
        onClose={() => setOpenPayment(false)}
      />
    </>
  );
}