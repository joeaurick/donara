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
  
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const subtotal = cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);
  const diskon = 0;
  const pajak = 0;
  const total = subtotal - diskon + pajak;

  const totalItemCount = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
  const kembalian = Math.max(0, nominalPaid - total);

  useEffect(() => {
    if (isModalOpen && !isSuccess) {
      setNominalPaid(total);
    }
  }, [isModalOpen, total, isSuccess]);

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
    setIsProcessing(true);
    try {
      const invoiceNumber = `INV-${Date.now()}`; 
      const transactionData = {
        invoice: invoiceNumber,
        total: total,
        subtotal: subtotal,
        discount: 0,
        tax: 0,
        paid: paymentMethod === "CASH" ? nominalPaid : total,
        change: paymentMethod === "CASH" ? kembalian : 0,
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
      };

      console.log("Data yang akan dikirim:", transactionData); // LIHAT DI CONSOLE F12

      const { data, error } = await supabase
        .from("transactions")
        .insert([transactionData])
        .select(); // Tambahkan .select() agar kita bisa melihat datanya kembali

      if (error) {
        console.error("Gagal saat INSERT:", error);
        alert("Error Database: " + error.message);
        return;
      }

      console.log("Data yang berhasil masuk ke DB:", data); // LIHAT DI CONSOLE F12
      alert("Transaksi Berhasil Disimpan!");
      forceClearCart();
      setIsSuccess(true);
    } catch (error: any) {
      alert("Error sistem: " + error.message);
    } finally {
      setIsProcessing(false);
    }
}

  function handlePrintReceipt() {
    if (!receiptData) return;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) {
      alert("Gagal membuka jendela cetak. Izinkan pop-up di browser Anda.");
      return;
    }

    const itemsHtml = receiptData.items
      .map(
        (item: any) => `
        <div class="flex" style="margin-bottom: 3px;">
          <span style="max-width: 70%; word-break: break-word;">${item.name} x${item.qty}</span>
          <span>${(item.price * item.qty).toLocaleString("id-ID")}</span>
        </div>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak Struk</title>
          <style>
            @page {
              size: auto;
              margin: 0mm;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              line-height: 1.2;
              color: #000;
              margin: 0;
              padding: 6mm 4mm;
              width: 70mm; /* Atur ke 50mm untuk kertas 58mm, atau 70mm untuk 80mm */
              box-sizing: border-box;
            }
            .center { text-align: center; }
            .line { border-bottom: 1px dashed #000; margin: 6px 0; }
            .flex { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="center">
            <span style="font-size: 14px; font-weight: bold; display: block; letter-spacing: 1px;">DONARA POS</span>
            <span style="font-size: 10px; display: block; margin-top: 2px;">${receiptData.date}</span>
          </div>
          <div class="line"></div>
          <div>${itemsHtml}</div>
          <div class="line"></div>
          <div style="font-size: 11px;">
            <div class="flex bold" style="font-size: 12px; margin-bottom: 2px;">
              <span>TOTAL</span>
              <span>Rp ${receiptData.total.toLocaleString("id-ID")}</span>
            </div>
            <div class="flex">
              <span>Metode:</span>
              <span>${receiptData.paymentMethod}</span>
            </div>
            <div class="flex">
              <span>Bayar:</span>
              <span>Rp ${receiptData.nominalPaid.toLocaleString("id-ID")}</span>
            </div>
            <div class="flex bold" style="margin-top: 3px; border-top: 1px dotted #000; padding-top: 3px;">
              <span>Kembali:</span>
              <span>Rp ${receiptData.kembalian.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <div class="center" style="font-size: 10px; margin-top: 15px; padding-top: 6px; border-top: 1px dashed #000;">
            Terima Kasih Atas Kunjungan Anda
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 300);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  function handleCloseAll() {
    setIsModalOpen(false);
    setIsSuccess(false);
    setReceiptData(null);
    setPaymentMethod("CASH");
    setNominalPaid(0);
    if (onPaymentSuccess) {
      onPaymentSuccess();
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[90vh]">
            {!isSuccess ? (
              <>
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tagihan Transaksi</div>
                    <div className="text-3xl font-black text-pink-600 tracking-tight mt-0.5">Rp {total.toLocaleString("id-ID")}</div>
                  </div>
                  <button onClick={() => { if(!isProcessing) setIsModalOpen(false); }} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors text-xs font-bold">✕</button>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400 block">Pilih Metode</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => { setPaymentMethod("CASH"); setNominalPaid(total); }} className={`py-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-black text-xs transition-all ${paymentMethod === "CASH" ? "bg-emerald-600 text-white border-emerald-600 shadow-md" : "bg-white text-gray-700 border-gray-100"}`}><span>💵</span><span>Cash</span></button>
                    <button type="button" onClick={() => { setPaymentMethod("QRIS"); setNominalPaid(total); }} className={`py-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-black text-xs transition-all ${paymentMethod === "QRIS" ? "bg-pink-600 text-white border-pink-600 shadow-md" : "bg-white text-gray-700 border-gray-100"}`}><span>📱</span><span>QRIS</span></button>
                    <button type="button" onClick={() => { setPaymentMethod("TRANSFER"); setNominalPaid(total); }} className={`py-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-black text-xs transition-all ${paymentMethod === "TRANSFER" ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-700 border-gray-100"}`}><span>🏦</span><span>Transfer</span></button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400 block">Jumlah Uang Diterima</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                    <input type="number" disabled={paymentMethod !== "CASH"} value={nominalPaid || ""} onChange={(e) => setNominalPaid(Number(e.target.value))} className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-pink-500 text-base font-black text-gray-800 disabled:bg-gray-50 disabled:text-gray-400" placeholder="0" />
                  </div>
                </div>
                {paymentMethod === "CASH" && (
                  <div className="mt-3 space-y-2">
                    <button type="button" onClick={() => setNominalPaid(total)} className="w-full py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-center gap-1">✓ Uang Pas</button>
                    <div className="grid grid-cols-3 gap-2">
                      {[20000, 50000, 100000].map((money) => (<button key={money} type="button" onClick={() => setNominalPaid(money)} className="py-2.5 bg-gray-100 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-200 transition-all">{money / 1000}K</button>))}
                    </div>
                  </div>
                )}
                <div className="mt-4 bg-gray-50 rounded-xl p-4 flex flex-col gap-2 border border-gray-100">
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider"><span>Total Item Belanja</span><span className="text-gray-700 font-black">{totalItemCount} Qty</span></div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-gray-200/60"><span className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">Uang Kembalian</span><span className="text-xl font-black text-emerald-600 tracking-tight">Rp {paymentMethod === "CASH" ? kembalian.toLocaleString("id-ID") : "0"}</span></div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button type="button" disabled={isProcessing} onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl border-2 border-gray-100 py-3 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">Batal</button>
                  <button type="button" disabled={isProcessing || (paymentMethod === "CASH" && nominalPaid < total)} onClick={handleProcessPayment} className="flex-1 rounded-xl bg-pink-600 py-3 text-xs font-black text-white hover:bg-pink-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-sm">{isProcessing ? "Memproses..." : `Konfirmasi Sukses`}</button>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl mb-3">✓</div>
                <h3 className="text-lg font-black text-gray-800">Pembayaran Sukses!</h3>
                <p className="text-xs text-gray-400 mt-0.5 mb-6">Transaksi telah dicatat ke sistem</p>
                <div className="space-y-2">
                  <button type="button" onClick={handlePrintReceipt} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 transition-colors">🖨️ Cetak Struk Belanja</button>
                  <button type="button" onClick={handleCloseAll} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors">Selesai & Transaksi Baru</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}