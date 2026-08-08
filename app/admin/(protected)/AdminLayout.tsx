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
    <div className="flex min-h-screen bg-gradient-to-b from-[#fff8f7] via-[#fffdfc] to-white">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
  <Sidebar open={open} setOpen={setOpen} />
</div>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <div
  className={`absolute left-0 top-0 h-full transform transition-transform duration-300 ${
    open ? "translate-x-0" : "-translate-x-full"
  }`}
>
          <div className="flex items-center justify-between border-b border-pink-100 px-4 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
                Donara
              </p>
              <h2 className="text-lg font-black text-slate-900">CMS Admin</h2>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-pink-100 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-[calc(100%-73px)] overflow-y-auto">
            <Sidebar open={open} setOpen={setOpen} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-pink-100 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 xl:hidden"
                aria-label="Buka menu"
              >
                <div
                  className={`transform transition-transform duration-300 ${
                    open ? "rotate-90 scale-110" : "rotate-0 scale-100"
                  }`}
                >
                  <Menu className="h-5 w-5" />
                </div>
              </button>

              <div className="hidden sm:flex items-center gap-3">
  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 text-xl">
    ⏰
  </div>

  <div className="leading-tight">
    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-pink-500">
      JAM SEKARANG
    </p>

    <div className="text-lg font-black text-slate-900 font-mono tracking-wide">
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

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari menu..."
                  className="h-10 w-64 rounded-full border border-pink-100 bg-pink-50/60 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                />
              </div>

              {/* Notification */}
              <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500" />
              </button>

              {/* Admin Avatar */}
              <div className="flex items-center gap-3 rounded-full border border-pink-100 bg-white px-3 py-2 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-sm font-bold text-white">
                  D
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-900">
                    Admin Donara
                  </p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#fff8f7] to-[#fffdfc]">
  <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
    {children}
  </div>
</main>
      </div>
    </div>
  );
}