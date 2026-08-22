"use client";

import { ShoppingBag, X } from "lucide-react";

import { useMobileCart } from "../context/MobileCartContext";
import CartPanel from "./CartPanel";

export default function MobileCartSheet() {
  const { open, closeCart } = useMobileCart();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-[250] bg-[#2d1b16]/40 backdrop-blur-[2px] xl:hidden"
      />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-[300] flex h-[88vh] flex-col overflow-hidden rounded-t-[32px] border-x border-t border-orange-100 bg-[#fffaf5] shadow-[0_-20px_60px_rgba(45,27,22,0.20)] xl:hidden animate-in slide-in-from-bottom duration-300">
        {/* Handle Area */}
        <div className="relative shrink-0 px-5 pt-3">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-orange-200" />

          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-100/70 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 top-8 h-20 w-20 rounded-full bg-orange-100/80 blur-2xl" />
        </div>

        {/* Header */}
        <div className="relative mt-4 flex shrink-0 items-center justify-between border-b border-orange-100 bg-white/70 px-5 pb-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200/70">
              <ShoppingBag size={20} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-base font-black tracking-tight text-[#2d1b16]">
                Keranjang Belanja
              </h2>

              <p className="mt-0.5 text-[11px] font-medium text-stone-400">
                Periksa pesanan sebelum pembayaran
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-[#fffaf5] text-stone-500 shadow-sm transition-all hover:bg-pink-50 hover:text-pink-600 active:scale-95"
            aria-label="Tutup keranjang"
          >
            <X size={20} strokeWidth={2.5} />
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