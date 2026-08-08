"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Props = {
  todayStock: any;
  todayClosed: boolean;
  closing: boolean;
  handleCloseDay: () => void;
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
    <header className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* KIRI */}
        <div className="min-w-0">
          <h1 className="text-2xl font-black text-pink-600">
            DONARA POS
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-6 text-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Tanggal
              </p>

              <p className="font-semibold text-gray-700">
                {now
                  ? now.toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Memuat..."}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Jam
              </p>

              <p className="font-mono text-xl font-black tracking-wider text-pink-600">
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

        {/* KANAN */}
        <div className="flex flex-col items-start gap-3 xl:items-end">
          {todayStock && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatCard
                label="Status"
                value={todayClosed ? "🔴 Tutup" : "🟢 Buka"}
              />

              <StatCard
                label="Stok"
                value={todayStock.opening_stock}
              />

              <StatCard
                label="Sisa"
                value={todayStock.remaining_stock}
                color="text-green-600"
              />

              <StatCard
                label="Terjual"
                value={
                  todayStock.opening_stock -
                  todayStock.remaining_stock
                }
                color="text-orange-600"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {todayClosed ? (
              <button
                onClick={() => {
                  if (handleOpenDay) {
                    handleOpenDay();
                  } else {
                    window.location.reload();
                  }
                }}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
              >
                Buka Toko
              </button>
            ) : (
              <button
                onClick={handleCloseDay}
                disabled={closing}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:bg-gray-400"
              >
                {closing ? "Menutup..." : "Tutup Toko"}
              </button>
            )}

            <button
              onClick={logout}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatCard({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="min-w-[88px] rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className={`mt-1 text-sm font-black ${color}`}>
        {value}
      </p>
    </div>
  );
}