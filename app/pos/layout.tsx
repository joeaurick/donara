"use client";

import { usePathname } from "next/navigation";
import {
  useState,
  type ReactNode,
  useEffect,
} from "react";
import Link from "next/link";

import PosSidebar from "./components/PosSidebar";
import MobileBottomNav from "./components/MobileBottomNav";

import { CartProvider } from "./context/CartContext";
import { MobileCartProvider } from "./context/MobileCartContext";

import { isTodayClosed } from "@/lib/supabase/daily-stock";

export default function PosLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [storeClosed, setStoreClosed] =
    useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const closed = await isTodayClosed();
        setStoreClosed(closed);
      } catch (err) {
        console.error(err);
      }
    }

    loadStatus();
  }, []);

  if (pathname === "/pos/login") {
    return <>{children}</>;
  }

  const menuItems = [
    {
      name: "Dashboard / Kasir",
      href: "/pos",
      icon: "🏠",
    },
    {
      name: "Riwayat Transaksi",
      href: "/pos/history",
      icon: "📜",
    },
    {
      name: "Laporan",
      href: "/pos/report",
      icon: "📊",
    },
    {
      name: "Pengaturan",
      href: "/pos/settings",
      icon: "⚙️",
    },
  ];

  return (
    <CartProvider>
      <MobileCartProvider>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block">
            <PosSidebar />
          </div>

          {/* Main Content */}
          <main className="relative flex-1 overflow-auto pb-20 lg:pb-0">
            {/* Header Mobile */}
            <div className="sticky top-0 z-[40] flex items-center justify-between border-b bg-white px-4 py-3 shadow-xs lg:hidden">
              <span className="text-md font-black tracking-tight">
                CUSTOM POS {storeClosed ? "(Tutup)" : ""}
              </span>

              <button
                type="button"
                onClick={() =>
                  setIsMenuOpen(!isMenuOpen)
                }
                className="rounded-xl p-2 text-xl font-bold text-gray-600 transition-colors hover:bg-gray-100 active:scale-95"
              >
                {isMenuOpen ? "✕" : "☰"}
              </button>
            </div>

            {/* Drawer Mobile */}
<>
  {/* Overlay */}
  {isMenuOpen && (
    <div
      onClick={() => setIsMenuOpen(false)}
      className="fixed inset-0 z-[45] bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
    />
  )}

  {/* Drawer */}
  <div
    className={`fixed top-0 right-0 bottom-0 z-[50] w-[86vw] max-w-[320px] overflow-hidden bg-white shadow-[0_20px_60px_rgba(15,23,42,0.28)] transition-transform duration-300 ease-out lg:hidden ${
      isMenuOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-pink-100 bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500 px-5 py-6 text-white">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-lg font-black shadow-lg backdrop-blur-md">
              D
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">
                CUSTOMPOS
              </h2>

              <p className="text-xs text-pink-100">
                Donara Point of Sale
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-black text-white backdrop-blur transition hover:bg-white/25 active:scale-95"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-4 px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
            Menu Navigasi
          </p>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/pos"
                ? pathname === "/pos" ||
                  pathname === "/pos/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-slate-600 hover:bg-pink-50 hover:text-pink-600"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-pink-100 group-hover:text-pink-600"
                  }`}
                >
                  {item.icon}
                </span>

                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">
                    {item.name}
                  </span>

                  {isActive && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white shadow-sm" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/80 p-4">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg">
              🟢
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Status Toko
              </p>

              <p className="text-sm font-bold text-emerald-600">
                {storeClosed ? "Tutup" : "Operasional"}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/admin"
          onClick={() => setIsMenuOpen(false)}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-600 shadow-sm transition hover:bg-pink-50 active:scale-[0.98]"
        >
          <span className="text-base">🏪</span>
          Menu Admin
        </Link>

        <Link
  href="/pos/login"
  onClick={() => setIsMenuOpen(false)}
  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 transition hover:from-red-600 hover:to-rose-600 active:scale-[0.98]"
>
  <span className="text-base">🚪</span>
  Logout
</Link>

        <div className="mt-4 text-center text-[10px] font-medium text-slate-400">
          CUSTOMPOS • v1.0
        </div>
      </div>
    </div>
  </div>
</>


            {/* Page Content */}
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>

          {/* Bottom Navigation Mobile */}
          <MobileBottomNav />
        </div>
      </MobileCartProvider>
    </CartProvider>
  );
}