"use client";

import { ReactNode, useEffect, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";

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
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-b from-[#fff8f7] via-[#fffdfc] to-white">
      {/* =========================
          SIDEBAR DESKTOP
      ========================== */}

      <div className="hidden xl:block">
        <Sidebar
          open={false}
          setOpen={setOpen}
        />
      </div>

      {/* =========================
          SIDEBAR MOBILE
      ========================== */}

      <div
        className={`fixed inset-0 z-[100] xl:hidden ${
          open
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        {/* OVERLAY */}

        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[#2d1b16]/50 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* DRAWER */}

        <div
          className={`absolute bottom-0 left-0 top-0 w-[86vw] max-w-[340px] transition-transform duration-300 ease-out ${
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
          CONTENT
      ========================== */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}

        <header className="sticky top-0 z-30 shrink-0 border-b border-pink-100 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[72px] w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-3">
              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-pink-100 bg-white text-slate-700 shadow-sm transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 active:scale-95 xl:hidden"
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* DESKTOP CLOCK */}

              <div className="hidden min-w-0 items-center gap-3 sm:flex">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-xl text-pink-600">
                  ⏰
                </div>

                <div className="min-w-0 leading-tight">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-pink-500">
                    JAM SEKARANG
                  </p>

                  <div className="font-mono text-lg font-black tracking-wide text-slate-900">
                    {now.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>

                  <p className="truncate text-xs text-slate-500">
                    {now.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* MOBILE TITLE */}

              <div className="min-w-0 sm:hidden">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-pink-500">
                  DONARA
                </p>

                <h1 className="truncate text-base font-black text-slate-900">
                  CMS Admin
                </h1>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {/* SEARCH */}

              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Cari menu..."
                  className="h-10 w-64 rounded-full border border-pink-100 bg-pink-50/60 pl-10 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              {/* NOTIFICATION */}

              <button
                type="button"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-white text-slate-600 shadow-sm transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                aria-label="Notifikasi"
              >
                <Bell className="h-5 w-5" />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500" />
              </button>

              {/* ADMIN AVATAR */}

              <div className="flex items-center gap-3 rounded-full border border-pink-100 bg-white px-2 py-2 shadow-sm sm:px-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-sm font-bold text-white">
                  D
                </div>

                <div className="hidden text-left md:block">
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

        {/* MAIN */}

        <main className="min-w-0 flex-1 overflow-y-auto bg-gradient-to-b from-[#fff8f7] to-[#fffdfc]">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}