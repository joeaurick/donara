"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  type ReactNode,
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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storeClosed, setStoreClosed] = useState(false);

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
      name: "Kasir",
      description: "Transaksi & pesanan",
      href: "/pos",
      icon: "🏪",
    },
    {
      name: "Riwayat",
      description: "Transaksi sebelumnya",
      href: "/pos/history",
      icon: "📋",
    },
    {
      name: "Laporan",
      description: "Ringkasan penjualan",
      href: "/pos/report",
      icon: "📊",
    },
    {
      name: "Pengaturan",
      description: "Atur POS",
      href: "/pos/settings",
      icon: "⚙️",
    },
  ];

  return (
    <CartProvider>
      <MobileCartProvider>
        <div className="flex min-h-screen bg-[#f8f7f5]">
          {/* =========================
              SIDEBAR DESKTOP
          ========================== */}
          <div className="hidden lg:block">
            <PosSidebar />
          </div>

          {/* =========================
              MAIN CONTENT
          ========================== */}
          <main className="relative flex-1 overflow-auto pb-20 lg:pb-0">
            {/* =========================
                HEADER MOBILE
            ========================== */}
            <div className="sticky top-0 z-[40] flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
              <div>
                <p className="text-base font-black tracking-tight text-pink-600">
                  DONARA POS
                </p>

                <p
                  className={`mt-0.5 text-[10px] font-semibold ${
                    storeClosed
                      ? "text-red-500"
                      : "text-emerald-600"
                  }`}
                >
                  {storeClosed
                    ? "● Toko sedang tutup"
                    : "● Toko sedang operasional"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 text-xl font-bold text-white shadow-md shadow-pink-500/30 transition active:scale-95"
                aria-label="Buka menu"
              >
                {isMenuOpen ? "✕" : "☰"}
              </button>
            </div>

            {/* =========================
                OVERLAY MOBILE
            ========================== */}
            {isMenuOpen && (
              <div
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-[190] bg-black/35 backdrop-blur-[2px] lg:hidden"
              />
            )}

            {/* =========================
                MOBILE SIDEBAR
            ========================== */}
            <aside
              className={`fixed bottom-0 left-0 top-0 z-[200] flex h-dvh w-[84vw] max-w-[330px] flex-col overflow-hidden bg-[#fdfcfb] shadow-[14px_0_45px_rgba(15,23,42,0.22)] transition-transform duration-300 ease-out lg:hidden ${
                isMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
              }`}
            >
              {/* =========================
                  AREA SCROLL
              ========================== */}
              <div className="flex-1 overflow-y-auto">
                {/* =========================
                    BRAND CARD
                ========================== */}
                <div className="px-4 pt-4">
                  <div className="relative min-h-[145px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2d1711] via-[#45271b] to-[#291611] px-4 py-4 text-white shadow-[0_12px_28px_rgba(60,30,20,0.22)]">
                    {/* Decorative circles */}
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-pink-500/15" />

                    <div className="absolute -right-5 top-8 h-20 w-20 rounded-full bg-orange-500/10" />

                    <div className="absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-orange-500/10" />

                    {/* Decorative donut */}
                    <div className="absolute -right-5 top-2 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 via-pink-400 to-orange-300 opacity-80 shadow-xl">
                      <div className="h-9 w-9 rounded-full bg-[#3b2118]" />

                      <span className="absolute left-4 top-3 text-[8px]">
                        ✦
                      </span>

                      <span className="absolute right-4 top-5 text-[8px]">
                        ✦
                      </span>

                      <span className="absolute bottom-4 left-5 text-[8px]">
                        ✦
                      </span>

                      <span className="absolute bottom-4 right-4 text-[8px]">
                        ✦
                      </span>
                    </div>

                    {/* HEADER BRAND */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-pink-400 via-pink-500 to-pink-700 text-xl font-black shadow-lg shadow-pink-950/30">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px]">
                            ●
                          </div>

                          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-orange-300" />
                        </div>

                        <div>
                          <h1 className="text-[22px] font-black tracking-wide">
                            DONARA
                          </h1>

                          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/80">
                            Point of Sale
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* STATUS TOKO */}
                    <div className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          storeClosed
                            ? "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"
                            : "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        }`}
                      />

                      <span className="text-[10px] font-medium text-white/90">
                        {storeClosed
                          ? "Toko sedang tutup"
                          : "Toko sedang operasional"}
                      </span>
                    </div>

                    {/* CLOSE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(false)}
                      className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-light text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
                      aria-label="Tutup menu"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* =========================
                    MENU TITLE
                ========================== */}
                <div className="px-5 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-orange-200" />

                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.22em] text-orange-500">
                      Menu Utama
                    </span>

                    <div className="h-px flex-1 bg-orange-200" />
                  </div>
                </div>

                {/* =========================
                    MENU NAVIGATION
                ========================== */}
                <nav className="px-4 py-4">
                  <div className="space-y-2.5">
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
                          className={`group relative flex min-h-[66px] items-center gap-3 rounded-[20px] px-3 py-3 transition-all duration-200 ${
                            isActive
                              ? "border border-pink-200 bg-gradient-to-r from-pink-50 via-white to-pink-50 shadow-[0_8px_18px_rgba(236,72,153,0.10)]"
                              : "border border-transparent bg-white hover:border-orange-100 hover:bg-orange-50/30"
                          }`}
                        >
                          {/* Active line */}
                          {isActive && (
                            <span className="absolute -left-2 top-3 bottom-3 w-1 rounded-full bg-pink-500" />
                          )}

                          {/* Icon */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-lg transition-all ${
                              isActive
                                ? "bg-gradient-to-br from-pink-500 to-pink-700 text-white shadow-md shadow-pink-500/25"
                                : "bg-gradient-to-br from-orange-50 to-orange-100/60 text-orange-500"
                            }`}
                          >
                            {item.icon}
                          </div>

                          {/* Text */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-black tracking-tight text-gray-800">
                              {item.name}
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-gray-500">
                              {item.description}
                            </p>
                          </div>

                          {/* Indicator */}
                          {isActive ? (
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-pink-500 text-[8px] text-pink-500">
                              ●
                            </span>
                          ) : (
                            <span className="shrink-0 text-[28px] font-light leading-none text-gray-400">
                              ›
                            </span>
                          )}
                        </Link>
                      );
                    })}

                    {/* =========================
                        MENU ADMIN
                    ========================== */}
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex min-h-[62px] items-center gap-3 rounded-[20px] border border-pink-200 bg-gradient-to-r from-white via-pink-50/50 to-pink-50 px-3 py-3 transition hover:bg-pink-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-lg shadow-sm">
                        🏪
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-black tracking-tight text-gray-800">
                          Menu Admin
                        </p>
                      </div>

                      <span className="shrink-0 text-[28px] font-light leading-none text-gray-400">
                        ›
                      </span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-gray-200" />

                  {/* =========================
                      LOGOUT
                  ========================== */}
                  

                  {/* Version */}
                  <div className="flex items-center justify-center gap-2 py-5 text-[10px] font-medium tracking-wide text-gray-500">
                    <span className="text-sm text-pink-500">
                      ◉
                    </span>

                    <span>
                      DONARA POS
                    </span>

                    <span className="text-gray-400">
                      •
                    </span>

                    <span>
                      v1.0
                    </span>
                  </div>
                </nav>
              </div>
            </aside>

            {/* =========================
                PAGE CONTENT
            ========================== */}
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>

          {/* =========================
              MOBILE BOTTOM NAVIGATION
          ========================== */}
          <MobileBottomNav />
        </div>
      </MobileCartProvider>
    </CartProvider>
  );
}