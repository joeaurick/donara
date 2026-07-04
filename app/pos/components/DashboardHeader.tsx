"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Props = {
  todayStock: any;
  todayClosed: boolean;
  closing: boolean;
  handleCloseDay: () => void;
  // Menambahkan callback untuk membuka toko kembali secara instan jika dibutuhkan oleh Admin
  handleOpenDay?: () => void; 
};

export default function DashboardHeader({
  todayStock,
  todayClosed,
  closing,
  handleCloseDay,
  handleOpenDay,
}: Props) {
  const router = useRouter();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set waktu di dalam useEffect untuk menghindari Next.js Hydration Error
    setNow(new Date());

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/pos/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">

        {/* ========================= */}
        {/* KIRI: Informasi Waktu     */}
        {/* ========================= */}
        <div>
          <h1 className="text-3xl font-black text-pink-600">
            DONARA POS
          </h1>
          <p className="text-sm text-gray-500">
            Point of Sale
          </p>

          <div className="mt-4 flex flex-wrap gap-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Tanggal
              </p>
              <p className="font-semibold text-gray-700">
                {now
                  ? now.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Memuat..."}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Jam Real-Time
              </p>
              <p className="text-2xl font-black text-pink-600 font-mono tracking-wider">
                {now
                  ? now.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "00:00:00"}
              </p>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* KANAN: Kontrol & Stok     */}
        {/* ========================= */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          
          {todayStock && (
            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl bg-gray-100 px-4 py-2">
                <p className="text-xs text-gray-500">Status Toko</p>
                <p className={`font-bold ${todayClosed ? "text-red-600" : "text-green-600"}`}>
                  {todayClosed ? "🔴 TUTUP" : "🟢 BUKA"}
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 px-4 py-2">
                <p className="text-xs text-gray-500">Stok Awal</p>
                <p className="font-bold">{todayStock.opening_stock}</p>
              </div>

              <div className="rounded-xl bg-gray-100 px-4 py-2">
                <p className="text-xs text-gray-500">Sisa Stok</p>
                <p className="font-bold text-green-600">{todayStock.remaining_stock}</p>
              </div>

              <div className="rounded-xl bg-gray-100 px-4 py-2">
                <p className="text-xs text-gray-500">Terjual</p>
                <p className="font-bold text-orange-600">
                  {todayStock.opening_stock - todayStock.remaining_stock}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {/* FITUR TOMBOL AKSES: Tampilkan Buka Toko jika toko tutup */}
            {todayClosed ? (
              <button
                onClick={() => {
                  if (handleOpenDay) {
                    handleOpenDay();
                  } else {
                    // Fallback jika belum dihubungkan ke parent, langsung pancing ulang halaman
                    window.location.reload(); 
                  }
                }}
                className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
              >
                Buka Toko Kembali
              </button>
            ) : (
              <button
                onClick={handleCloseDay}
                disabled={closing}
                className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:bg-gray-400"
              >
                {closing ? "Menutup..." : "Tutup Toko"}
              </button>
            )}

            <button
              onClick={logout}
              className="rounded-xl bg-gray-800 px-5 py-3 font-bold text-white hover:bg-black transition-colors"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}