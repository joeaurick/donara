"use client";

import { useEffect, useState } from "react";
import { getTodayReport, getTopProducts, getHourlySales, getPaymentSummary } from "@/lib/supabase/report";
import { getTodayStock } from "@/lib/supabase/daily-stock";
import SalesChart from "../components/SalesChart";
import PaymentChart from "../components/PaymentChart";
import { exportReportExcel } from "@/lib/exportExcel";
import { exportReportPdf } from "@/lib/exportPdf";

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [stock, setStock] = useState<any>(null);
  const [hourlySales, setHourlySales] = useState<any[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<any[]>([]);
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const [isLoading, setIsLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      // Mengambil data secara paralel agar lebih cepat
      const [r, p, s, h, pay] = await Promise.all([
        getTodayReport(period),
        getTopProducts(period),
        getTodayStock(),
        getHourlySales(period),
        getPaymentSummary()
      ]);

      setReport(r);
      setProducts(p);
      setStock(s);
      setHourlySales(h);
      setPaymentSummary(pay);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [period]);

  if (!report && !isLoading) {
    return <div className="p-6">Data tidak ditemukan.</div>;
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="mb-6 text-3xl font-black">Laporan Omzet</h1>

      {/* Kontrol Periode */}
      <div className="mb-6 flex gap-3">
        {(["today", "week", "month"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-xl px-4 py-2 font-bold transition ${
              period === p ? "bg-pink-600 text-white" : "bg-white border border-gray-200"
            }`}
          >
            {p === "today" ? "Hari Ini" : p === "week" ? "7 Hari" : "30 Hari"}
          </button>
        ))}
      </div>

      {/* Tombol Export */}
      <div className="mb-6 flex justify-end gap-3">
        <button onClick={() => exportReportPdf(report, products)} className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-700">Export PDF</button>
        <button onClick={() => exportReportExcel(report, products)} className="rounded-xl bg-green-600 px-5 py-2 font-bold text-white hover:bg-green-700">Export Excel</button>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-gray-500">Memperbarui data...</div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow"><p className="text-gray-500">Omzet</p><h2 className="mt-2 text-3xl font-black text-pink-600">Rp {report?.omzet?.toLocaleString("id-ID") || 0}</h2></div>
            <div className="rounded-2xl bg-white p-5 shadow"><p className="text-gray-500">Transaksi</p><h2 className="mt-2 text-3xl font-black">{report?.transaksi || 0}</h2></div>
            <div className="rounded-2xl bg-white p-5 shadow"><p className="text-gray-500">Donat Terjual</p><h2 className="mt-2 text-3xl font-black text-green-600">{stock ? stock.opening_stock - stock.remaining_stock : 0}</h2></div>
            <div className="rounded-2xl bg-white p-5 shadow"><p className="text-gray-500">Sisa Donat</p><h2 className="mt-2 text-3xl font-black text-yellow-600">{stock?.remaining_stock || 0}</h2></div>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-black">Produk Terlaris</h2>
            {products.length === 0 ? <p className="text-gray-500">Belum ada penjualan.</p> : (
              <div className="space-y-3">
                {products.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl border p-4">
                    <span className="font-bold">{item.name}</span>
                    <span className="rounded-full bg-pink-100 px-3 py-1 font-bold text-pink-600">{item.qty} pcs</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <SalesChart data={hourlySales} />
            <PaymentChart data={paymentSummary} />
          </div>
        </>
      )}
    </main>
  );
}