"use client";

import { useCart } from "../context/CartContext";
import CartSummary from "./CartSummary";

interface CartPanelProps {
  onPaymentSuccess?: () => void;
}

export default function CartPanel({ onPaymentSuccess }: CartPanelProps) {
  const { cart, increase, decrease, remove } = useCart();
  const todayClosed = false;

  const totalItem = cart.reduce((sum, item) => sum + item.qty, 0);

  function blockIfClosed() {
    if (todayClosed) {
      alert("Toko sudah tutup. Transaksi tidak bisa dilakukan.");
      return true;
    }
    return false;
  }

  return (
    <div className="flex h-full w-full flex-col bg-white overflow-hidden">
      
      {/* Header Panel */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-700">Keranjang Kasir</h2>
        <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
          {totalItem} Item
        </span>
      </div>

      {/* List Item Area */}
      <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-gray-50">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center py-20">
            <div className="text-5xl mb-4 animate-bounce duration-1000">🛒</div>
            <p className="text-base font-bold text-gray-700">Keranjang Kosong</p>
            <p className="mt-1 text-xs text-gray-400 max-w-[200px]">
              Klik item menu di sebelah kiri untuk menambahkan pesanan
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="p-5 hover:bg-gray-50/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm text-gray-800 truncate flex items-center gap-1.5">
                    {item.name}
                    {item.isPackage && (
                      <span className="shrink-0 rounded-md bg-pink-50 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-pink-600 border border-pink-100">
                        PAKET
                      </span>
                    )}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400">
                    Rp {item.price.toLocaleString("id-ID")} × {item.qty}
                  </p>

                  {/* Detil Isi Paket */}
                  {item.isPackage && item.packageProducts && item.packageProducts.length > 0 && (
                    <div className="mt-2 rounded-xl bg-gray-50 p-3 border border-gray-100 space-y-1">
                      {item.packageProducts.map((p) => (
                        <div key={p.id} className="flex justify-between text-[11px] text-gray-500 font-medium">
                          <span>• {p.name}</span>
                          <span className="font-bold">x{p.qty}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-sm text-gray-900">
                    Rp {(item.price * item.qty).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Tombol Kontrol Kuantitas */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => { if (!blockIfClosed()) decrease(item.id); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white font-black text-gray-600 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-xs font-black text-gray-800">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => { if (!blockIfClosed()) increase(item.id); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-600 font-black text-white shadow-sm hover:bg-pink-700 active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => { if (!blockIfClosed()) remove(item.id); }}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ringkasan & Tombol Bayar */}
      <div className="border-t border-gray-100 bg-white shrink-0 w-full">
        <CartSummary onPaymentSuccess={onPaymentSuccess} />
      </div>

    </div>
  );
}