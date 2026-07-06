"use client";

import { useMobileCart } from "../context/MobileCartContext";
import CartPanel from "./CartPanel";

export default function MobileCartSheet() {
  const {
    open,
    closeCart,
  } = useMobileCart();

  // JIKA TIDAK OPEN, JANGAN RENDER APAPUN KE DOM.
  // Ini memutus loop setState dan mencegah React salah menghapus element Node DOM (removeChild error).
  if (!open) return null;

  return (
    <>
      {/* BACKDROP BACKGROUND */}
      <div
        onClick={closeCart}
        className="fixed inset-0 z-[290] bg-black/50 backdrop-blur-sm xl:hidden"
      />

      {/* KONTANER LACI UTAMA */}
      <div
        className="fixed inset-x-0 bottom-0 z-[300] h-[85vh] rounded-t-3xl bg-white flex flex-col overflow-hidden xl:hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Handle Garis Atas */}
        <div className="flex justify-center py-3 shrink-0 bg-white">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Tombol Tutup X */}
        <button
          onClick={closeCart}
          className="absolute right-4 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-black text-gray-500 active:scale-95 transition-all"
        >
          ✕
        </button>

        {/* BUNGKUSAN CARTPANEL */}
        <div className="flex-1 min-h-0 w-full overflow-hidden pb-safe">
          <CartPanel onPaymentSuccess={closeCart} />
        </div>

      </div>
    </>
  );
}