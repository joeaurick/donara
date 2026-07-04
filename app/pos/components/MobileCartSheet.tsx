"use client";

import { useMobileCart } from "../context/MobileCartContext";
import CartPanel from "./CartPanel";

export default function MobileCartSheet() {
  const {
    open,
    closeCart,
  } = useMobileCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/40 transition ${
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        } xl:hidden`}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 h-[95vh] rounded-t-3xl bg-white transition-transform duration-300 xl:hidden ${
          open
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >
        <div className="flex justify-center py-2">

          <div className="h-1.5 w-12 rounded-full bg-gray-300" />

        </div>

        <div className="h-[calc(95vh-16px)]">

          <CartPanel />

        </div>

      </div>
    </>
  );
}