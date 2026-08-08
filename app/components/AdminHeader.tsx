"use client";

import { useEffect, useState } from "react";

type Props = {
  title: string;
  subtitle: string;
};

export default function AdminHeader({
  title,
  subtitle,
}: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div className="flex-1">
        {/* JAM REAL-TIME */}
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-pink-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 text-xl">
            ⏰
          </div>

          <div className="leading-tight">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-pink-500">
              JAM SEKARANG
            </p>

            <div className="text-lg font-black text-slate-900 font-mono tracking-wide">
              {now
                ? now.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "00:00:00"}
            </div>

            <p className="text-xs text-slate-500">
              {now
                ? now.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Memuat tanggal..."}
            </p>
          </div>
        </div>

        {/* JUDUL HALAMAN */}
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          {subtitle}
        </p>
      </div>

      {/* Decorative Accent */}
      <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20 sm:flex">
        <div className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
    </div>
  );
}