"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "@/lib/supabase/client";

interface CartSummaryProps {
  onPaymentSuccess?: () => void;
}

export default function CartSummary({ onPaymentSuccess }: CartSummaryProps) {
  const context = useCart() as any;
  const cart = context?.cart || [];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [nominalPaid, setNominalPaid] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
  const diskon = 0;
  const pajak = 0;
  const total = subtotal - diskon + pajak;

  const totalItemCount = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
  const kembalian = Math.max(0, nominalPaid - total);

  useEffect(() => {
    if (isModalOpen) {
      setNominalPaid(total);
    }
  }, [isModalOpen, total]);

  function forceClearCart() {
    try {
      if (typeof context.clearCart === "function") {
        context.clearCart();
        return;
      }
      if (typeof context.setCart === "function") {
        context.setCart([]);
        return;
      }
      if (typeof context.remove === "function") {
        cart.forEach((item: any) => {
          context.remove(item.id);
        });
      }
    } catch (e) {
      console.error("Gagal mereset state keranjang:", e);
    }
  }

  async function handleProcessPayment() {
    if (paymentMethod === "CASH" && nominalPaid < total) {
      alert("Nominal yang dibayar kurang dari total tagihan!");
      return;
    }

    setIsProcessing(true);
    try {
      const { data: todayStock, error: stockError } = await supabase
        .from("daily_stock")
        .select("*")
        .eq("is_closed", false)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (stockError) throw stockError;

      if (!todayStock) {
        alert("Gagal memproses pembayaran: Toko belum dibuka atau data stok tidak ditemukan.");
        setIsProcessing(false);
        return;
      }

      const newRemainingStock = Math.max(0, (todayStock.remaining_stock || 0) - totalItemCount);

      const { error: updateError } = await supabase
        .from("daily_stock")
        .update({ remaining_stock: newRemainingStock })
        .eq("id", todayStock.id);

      if (updateError) throw updateError;

      forceClearCart();

      alert("Pembayaran Berhasil!");
      
      setIsModalOpen(false);
      setPaymentMethod("CASH");
      setNominalPaid(0);

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

    } catch (error: any) {
      alert("Gagal memproses transaksi: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="bg-gray-50 p-5 space-y-4 border-t border-gray-100">
      <div className="space-y-2 text-xs font-bold text-gray-500">
        <div className="flex justify-between items-center">
          <span>Subtotal Item</span>
          <span className="text-gray-700 font-extrabold">Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
        <span className="text-xs font-black uppercase tracking-wider text-gray-400">TOTAL BILL</span>
        <span className="text-2xl font-black text-pink-600 tracking-tight">
          Rp {total.toLocaleString("id-ID")}
        </span>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        disabled={cart.length === 0}
        className="w-full rounded-2xl bg-pink-600 py-4 px-6 text-center text-sm font-black tracking-wide text-white shadow-lg shadow-pink-600/10 hover:bg-pink-700 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
      >
        Proses Pembayaran
      </button>

      {/* POP UP PEMBAYARAN RESUABLE & KOMPATIBEL UNTUK SEMUA LAYAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
            
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex justify-between items-start mb-5">
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tagihan Transaksi</div>
                <div className="text-3xl font-black text-pink-600 tracking-tight mt-0.5">
                  Rp {total.toLocaleString("id-ID")}
                </div>
              </div>
              <button 
                onClick={() => { if(!isProcessing) setIsModalOpen(false); }}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Pilihan Metode Pembayaran */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-gray-400 block">Pilih Metode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod("CASH"); setNominalPaid(total); }}
                  className={`py-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-black text-xs transition-all ${
                    paymentMethod === "CASH" ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-gray-700 border-gray-100"
                  }`}
                >
                  <span className="text-xl">💵</span>
                  <span>Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod("QRIS"); setNominalPaid(total); }}
                  className={`py-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-black text-xs transition-all ${
                    paymentMethod === "QRIS" ? "bg-pink-600 text-white border-pink-600 shadow-md" : "bg-white text-gray-700 border-gray-100"
                  }`}
                >
                  <span className="text-xl">📱</span>
                  <span>QRIS</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setPaymentMethod("TRANSFER"); setNominalPaid(total); }}
                  className={`py-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-black text-xs transition-all ${
                    paymentMethod === "TRANSFER" ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-700 border-gray-100"
                  }`}
                >
                  <span className="text-xl">🏦</span>
                  <span>Transfer</span>
                </button>
              </div>
            </div>

            {/* Input Nominal Tunai */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-gray-400 block">Jumlah Uang Diterima</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                <input
                  type="number"
                  disabled={paymentMethod !== "CASH"}
                  value={nominalPaid || ""}
                  onChange={(e) => setNominalPaid(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-pink-500 text-base font-black text-gray-800 disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Shortcut Pecahan Uang Tunai */}
            {paymentMethod === "CASH" && (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setNominalPaid(total)}
                  className="w-full py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-center gap-1"
                >
                  ✓ Uang Pas
                </button>
                <div className="grid grid-cols-3 gap-2">
                  {[20000, 50000, 100000].map((money) => (
                    <button
                      key={money}
                      type="button"
                      onClick={() => setNominalPaid(money)}
                      className="py-2.5 bg-gray-100 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-200 transition-all"
                    >
                      {money / 1000}K
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status Kembalian */}
            <div className="mt-4 bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Total Item Belanja</span>
                <span className="text-gray-700 font-black">{totalItemCount} Qty</span>
              </div>
              <div className="flex justify-between items-baseline pt-1 border-t border-gray-200/60">
                <span className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">Uang Kembalian</span>
                <span className="text-xl font-black text-emerald-600 tracking-tight">
                  Rp {paymentMethod === "CASH" ? kembalian.toLocaleString("id-ID") : "0"}
                </span>
              </div>
            </div>

            {/* Konfirmasi Transaksi */}
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl border-2 border-gray-100 py-3 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isProcessing || (paymentMethod === "CASH" && nominalPaid < total)}
                onClick={handleProcessPayment}
                className="flex-1 rounded-xl bg-pink-600 py-3 text-xs font-black text-white hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-sm"
              >
                {isProcessing ? "Memproses..." : `Konfirmasi Sukses`}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}