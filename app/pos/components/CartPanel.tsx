"use client";

import { useCart } from "../context/CartContext";
import CartSummary from "./CartSummary";
import { motion, AnimatePresence } from "framer-motion";

interface CartPanelProps {
  onPaymentSuccess?: () => void;
}

export default function CartPanel({
  onPaymentSuccess,
}: CartPanelProps) {
  const {
    cart,
    increase,
    decrease,
    remove,
  } = useCart();

  const todayClosed = false;

  const totalItem = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  function blockIfClosed() {
    if (todayClosed) {
      alert(
        "Toko sudah tutup. Transaksi tidak bisa dilakukan."
      );

      return true;
    }

    return false;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header Panel */}
      <div className="shrink-0 border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-700">
            Keranjang Kasir
          </h2>

          <span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-600">
            {totalItem} Item
          </span>
        </div>
      </div>

      {/* List Item Area */}
      <div className="min-h-0 flex-1 divide-y divide-gray-50 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 py-20 text-center">
            <div className="mb-4 text-5xl">
              🛒
            </div>

            <p className="text-base font-bold text-gray-700">
              Keranjang Kosong
            </p>

            <p className="mt-1 max-w-[200px] text-xs text-gray-400">
              Klik item menu di sebelah kiri untuk menambahkan
              pesanan.
            </p>
          </div>
        ) : (
  <AnimatePresence initial={false}>
    {cart.map((item) => (
      <motion.div
        key={item.id}
        initial={{
          opacity: 0,
          y: 20,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          x: 40,
          scale: 0.9,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="p-5 hover:bg-gray-50/30 transition-colors"
      >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-extrabold text-gray-800">
                      {item.name}
                    </h3>

                    {item.isPackage && (
                      <span className="shrink-0 rounded-md border border-pink-100 bg-pink-50 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-pink-600">
                        PAKET
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Rp {item.price.toLocaleString("id-ID")} × {item.qty}
                  </p>

                  {/* Detail Paket */}
                  {item.isPackage &&
                    item.packageProducts &&
                    item.packageProducts.length > 0 && (
                      <div className="mt-3 space-y-1 rounded-xl border border-gray-100 bg-gray-50 p-3">
                        {item.packageProducts.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between text-[11px] font-medium text-gray-500"
                          >
                            <span>• {p.name}</span>
                            <span className="font-bold">
                              x{p.qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-gray-900">
                    Rp {(item.price * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Kontrol Qty */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!blockIfClosed()) {
                        decrease(item.id);
                      }
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white font-black text-gray-600 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
                  >
                    −
                  </button>

                  <span className="w-8 text-center text-xs font-black text-gray-800">
                    {item.qty}
                  </span>

                  <motion.button
  whileTap={{ scale: 0.8 }}
  whileHover={{ scale: 1.08 }}
  onClick={() => {
    if (!blockIfClosed()) increase(item.id);
  }}
  className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-600 font-black text-white shadow-sm hover:bg-pink-700 transition-all"
>
  +
</motion.button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!blockIfClosed()) {
                      remove(item.id);
                    }
                  }}
                  className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-50"
                >
                  🗑️ Hapus
                </button>
              </div>
                  </motion.div>
    ))}
  </AnimatePresence>
)}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-100 bg-white">
        <CartSummary
          onPaymentSuccess={onPaymentSuccess}
        />
      </div>
    </div>
  );
}