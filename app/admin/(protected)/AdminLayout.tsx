"use client";

import { ReactNode, useEffect, useState } from "react";
import { Menu, X, Bell, Search } from "lucide-react";

import Sidebar from "@/app/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f7] via-[#fffdfc] to-white">
      {/* =========================
          SIDEBAR DESKTOP
      ========================== */}

      <div className="fixed bottom-0 left-0 top-0 z-40 hidden md:block">
        <Sidebar
          open={false}
          setOpen={setOpen}
        />
      </div>

      {/* =========================
          SIDEBAR MOBILE
      ========================== */}

      <div
        className={`fixed inset-0 z-[100] md:hidden ${
          open
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        {/* OVERLAY */}

        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            open
              ? "opacity-100"
              : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* DRAWER */}

        <div
          className={`absolute bottom-0 left-0 top-0 w-[280px] max-w-[85vw] transition-transform duration-300 ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <Sidebar
            open={open}
            setOpen={setOpen}
            mobile
          />
        </div>
      </div>

      {/* =========================
          MAIN AREA
      ========================== */}

      <div className="min-h-screen md:ml-[272px]">
        {/* TOPBAR */}

        <header className="sticky top-0 z-30 border-b border-pink-100 bg-white/80 backdrop-blur-xl">
          <div className="flex h-[72px] w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            {/* LEFT */}

            <div className="flex items-center gap-3">
              <button
  type="button"
  onClick={() => setOpen((prev) => !prev)}
  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2d1b16] text-[#ffb703] shadow-[0_8px_20px_rgba(45,27,22,0.18)] transition-all duration-200 hover:bg-[#452820] active:scale-95 md:hidden"
  aria-label={open ? "Tutup menu" : "Buka menu"}
>
  {open ? (
    <X
      size={18}
      strokeWidth={2.5}
    />
  ) : (
    <Menu
      size={18}
      strokeWidth={2.8}
    />
  )}
</button>

              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-xl text-pink-600">
                  ⏰
                </div>

                <div className="leading-tight">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-pink-500">
                    Jam Sekarang
                  </p>

                  <div className="font-mono text-lg font-black tracking-wide text-slate-900">
                    {now.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>

                  <p className="text-xs text-slate-500">
                    {now.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">
              {/* SEARCH */}

              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Cari menu..."
                  className="h-10 w-64 rounded-full border border-pink-100 bg-pink-50/60 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                />
              </div>

              {/* NOTIFICATION */}

              <button
                type="button"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-white text-slate-600 shadow-sm transition-all hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
              >
                <Bell className="h-5 w-5" />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500" />
              </button>

              {/* ADMIN */}

              <div className="flex items-center gap-3 rounded-full border border-pink-100 bg-white px-3 py-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-sm font-bold text-white">
                  D
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-900">
                    Admin Donara
                  </p>

                  <p className="text-xs text-slate-500">
                    Super Admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* =========================
            CONTENT
        ========================== */}

        <main className="min-h-[calc(100vh-72px)]">
          <div className="w-full px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}