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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-pink-600">
            Laporan Omzet
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Pantau performa penjualan Donara secara real-time.
          </p>
        </div>

        {/* Tombol Export */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportReportPdf(report, products)}
            className="rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Export PDF
          </button>

          <button
            onClick={() => exportReportExcel(report, products)}
            className="rounded-xl bg-green-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-green-700"
          >
            Export Excel
          </button>
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Omzet
              </p>

              <h2 className="mt-3 text-3xl font-black text-pink-600">
                Rp {report?.omzet?.toLocaleString("id-ID") || 0}
              </h2>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Transaksi
              </p>

              <h2 className="mt-3 text-3xl font-black text-gray-900">
                {report?.transaksi || 0}
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