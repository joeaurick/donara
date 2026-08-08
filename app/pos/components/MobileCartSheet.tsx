"use client";

import { useMobileCart } from "../context/MobileCartContext";
import CartPanel from "./CartPanel";

export default function MobileCartSheet() {
  const { open, closeCart } = useMobileCart();

  // Jika tidak dibuka, jangan render apa pun.
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-sm xl:hidden"
      />

      {/* Drawer */}
      <div
        className="fixed inset-x-0 bottom-0 z-[300] flex h-[85vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl xl:hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Handle */}
        <div className="shrink-0 bg-white py-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-black text-pink-600">
            Keranjang
          </h2>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-black text-gray-500 transition-all hover:bg-gray-200 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-hidden pb-safe">
          <CartPanel />
        </div>
      </div>
    </>
  );
}