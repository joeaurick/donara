"use client";

import { useEffect, useState } from "react";
import {
  getTodayReport,
  getTopProducts,
  getHourlySales,
  getPaymentSummary,
} from "@/lib/supabase/report";
import { getTodayStock } from "@/lib/supabase/daily-stock";

import SalesChart from "../components/SalesChart";
import PaymentChart from "../components/PaymentChart";

import { exportReportExcel } from "@/lib/exportExcel";
import { exportReportPdf } from "@/lib/exportPdf";

type ReportType = {
  omzet: number;
  transaksi: number;
} | null;

export default function ReportPage() {
  const [report, setReport] = useState<ReportType>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [stock, setStock] = useState<any>(null);
  const [hourlySales, setHourlySales] = useState<any[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<any[]>([]);
  const cashTotal = paymentSummary
  .filter(
    (item) =>
      item.payment_method?.toUpperCase() === "CASH"
  )
  .reduce(
    (sum, item) =>
      sum + Number(item.total || 0),
    0
  );

const qrisTotal = paymentSummary
  .filter(
    (item) =>
      item.payment_method?.toUpperCase() === "QRIS"
  )
  .reduce(
    (sum, item) =>
      sum + Number(item.total || 0),
    0
  );

  const [period, setPeriod] = useState<
    "today" | "week" | "month"
  >("today");

  const [isLoading, setIsLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);

    try {
      const [r, p, s, h, pay] = await Promise.all([
        getTodayReport(period),
        getTopProducts(period),
        getTodayStock(),
        getHourlySales(period),
        getPaymentSummary(),
      ]);

      console.log("REPORT =", r);
      console.log("PRODUCT =", p);
      console.log("STOCK =", s);
      console.log("HOURLY =", h);
      console.log("PAYMENT =", pay);

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
    return (
      <main className="p-6">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm font-medium text-gray-400">
          Data laporan tidak ditemukan.
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="rounded-[28px] border border-pink-100 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 p-6 text-white shadow-xl md:p-8">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-100">
        📊 Dashboard Laporan
      </p>

      <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
        Laporan Omzet Donara
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-pink-50 md:text-base">
        Pantau performa penjualan, metode pembayaran, dan produk terlaris secara real-time dalam satu dashboard yang responsif.
      </p>
    </div>

    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => exportReportPdf(report, products)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/25"
      >
        📄 Export PDF
      </button>

      <button
        onClick={() => exportReportExcel(report, products)}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-400"
      >
        📊 Export Excel
      </button>
    </div>
  </div>
</div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        {(["today", "week", "month"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              period === p
                ? "bg-pink-600 text-white shadow-md"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p === "today"
              ? "Hari Ini"
              : p === "week"
              ? "7 Hari"
              : "30 Hari"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          Memperbarui data...
        </div>
      ) : (
        <>
          {/* Statistik */}
<div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
            <div className="col-span-2 rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <p className="text-xs font-black uppercase tracking-wider text-pink-600">
      💰 Total Omzet
    </p>

    <span className="rounded-full bg-pink-100 px-2 py-1 text-[10px] font-black text-pink-600">
      LIVE
    </span>
  </div>

  <h2 className="mt-4 text-3xl font-black tracking-tight text-pink-600 md:text-4xl">
    Rp {report?.omzet?.toLocaleString("id-ID") || 0}
  </h2>

  <p className="mt-2 text-xs text-slate-500">
    Total penjualan pada periode yang dipilih.
  </p>
</div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Transaksi
              </p>

              <h2 className="mt-3 text-3xl font-black text-gray-900">
                {report?.transaksi || 0}
              </h2>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
      💵 Cash
    </p>

    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black text-emerald-700">
      CASH
    </span>
  </div>

  <h2 className="mt-3 text-xl font-black text-emerald-700 md:text-2xl">
    Rp {cashTotal.toLocaleString("id-ID")}
  </h2>
</div>

<div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <p className="text-xs font-black uppercase tracking-wider text-blue-700">
      📱 QRIS
    </p>

    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-black text-blue-700">
      QRIS
    </span>
  </div>

  <h2 className="mt-3 text-xl font-black text-blue-700 md:text-2xl">
    Rp {qrisTotal.toLocaleString("id-ID")}
  </h2>
</div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Donat Terjual
              </p>

              <h2 className="mt-3 text-3xl font-black text-green-600">
                {stock
                  ? stock.opening_stock - stock.remaining_stock
                  : 0}
              </h2>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Sisa Donat
              </p>

              <h2 className="mt-3 text-3xl font-black text-yellow-600">
                {stock?.remaining_stock || 0}
              </h2>
            </div>
          </div>

          {/* Produk Terlaris */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">
                Produk Terlaris
              </h2>

              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Top Selling
              </span>
            </div>

            {products.length === 0 ? (
              <p className="text-sm text-gray-500">
                Belum ada penjualan pada periode ini.
              </p>
            ) : (
              <div className="space-y-3">
                {products.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-sm font-black text-pink-600">
                        #{index + 1}
                      </div>

                      <span className="font-semibold text-gray-800">
                        {item.name}
                      </span>
                    </div>

                    <span className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm font-black text-pink-600">
                      {item.qty} pcs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Chart */}
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-gray-900">
                Penjualan per Jam
              </h2>

              <SalesChart data={hourlySales} />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-gray-900">
                Metode Pembayaran
              </h2>

              <PaymentChart data={paymentSummary} />
            </div>
          </div>
        </>
      )}
    </main>
  );
}