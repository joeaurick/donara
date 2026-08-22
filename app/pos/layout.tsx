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
          {/* =====================================
              SIDEBAR DESKTOP
          ====================================== */}
          <div className="hidden lg:block">
            <PosSidebar />
          </div>

          {/* =====================================
              MAIN CONTENT
          ====================================== */}
          <main className="relative flex-1 overflow-auto pb-20 lg:pb-0">
            {/* =====================================
                HEADER MOBILE
            ====================================== */}
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

            {/* =====================================
                OVERLAY MOBILE
            ====================================== */}
            {isMenuOpen && (
              <div
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-[190] bg-black/35 backdrop-blur-[2px] lg:hidden"
              />
            )}

            {/* =====================================
                MOBILE SIDEBAR
            ====================================== */}
            <aside
              className={`fixed bottom-0 left-0 top-0 z-[200] flex h-dvh w-[82vw] max-w-[535px] flex-col overflow-hidden bg-[#fdfcfb] shadow-[14px_0_45px_rgba(15,23,42,0.22)] transition-transform duration-300 ease-out lg:hidden ${
                isMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
              }`}
            >
              {/* =====================================
                  AREA SCROLL SIDEBAR
              ====================================== */}
              <div className="flex-1 overflow-y-auto">
                {/* =====================================
                    BRAND CARD
                ====================================== */}
                <div className="px-6 pt-7">
                  <div className="relative min-h-[210px] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#2d1711] via-[#45271b] to-[#291611] px-7 py-7 text-white shadow-[0_15px_35px_rgba(60,30,20,0.25)]">
                    {/* Decorative circles */}
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-pink-500/15" />

                    <div className="absolute -right-6 top-12 h-28 w-28 rounded-full bg-orange-500/10" />

                    <div className="absolute -bottom-12 left-12 h-32 w-32 rounded-full bg-orange-500/10" />

                    {/* Decorative donut */}
                    <div className="absolute -right-5 top-5 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-pink-300 via-pink-400 to-orange-300 opacity-90 shadow-2xl">
                      <div className="h-14 w-14 rounded-full bg-[#3b2118]" />

                      <span className="absolute left-6 top-5 text-xs">
                        ✦
                      </span>

                      <span className="absolute right-7 top-8 text-[10px]">
                        ✦
                      </span>

                      <span className="absolute bottom-6 left-7 text-xs">
                        ✦
                      </span>

                      <span className="absolute bottom-7 right-6 text-[10px]">
                        ✦
                      </span>
                    </div>

                    {/* Header */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {/* Logo */}
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-pink-400 via-pink-500 to-pink-700 text-3xl font-black shadow-lg shadow-pink-950/30">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white text-sm">
                            ●
                          </div>

                          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-orange-300" />
                        </div>

                        <div>
                          <h1 className="text-[30px] font-black tracking-wide">
                            DONARA
                          </h1>

                          <p className="mt-1 text-[14px] font-medium uppercase tracking-[0.08em] text-white/80">
                            Point of Sale
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Store Status */}
                    <div className="relative z-10 mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-md">
                      <span
                        className={`h-3 w-3 rounded-full ${
                          storeClosed
                            ? "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                            : "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                        }`}
                      />

                      <span className="text-[15px] font-medium text-white/90">
                        {storeClosed
                          ? "Toko sedang tutup"
                          : "Toko sedang operasional"}
                      </span>
                    </div>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(false)}
                      className="absolute bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl font-light text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
                      aria-label="Tutup menu"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* =====================================
                    MENU TITLE
                ====================================== */}
                <div className="px-7 pt-9">
                  <div className="flex items-center gap-5">
                    <div className="h-px flex-1 bg-orange-200" />

                    <span className="shrink-0 text-[13px] font-bold uppercase tracking-[0.22em] text-orange-500">
                      Menu Utama
                    </span>

                    <div className="h-px flex-1 bg-orange-200" />
                  </div>
                </div>

                {/* =====================================
                    MENU
                ====================================== */}
                <nav className="px-7 py-8">
                  <div className="space-y-4">
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
                          className={`group relative flex min-h-[98px] items-center gap-5 rounded-[28px] px-4 py-4 transition-all duration-200 ${
                            isActive
                              ? "border border-pink-200 bg-gradient-to-r from-pink-50 via-white to-pink-50 shadow-[0_10px_25px_rgba(236,72,153,0.12)]"
                              : "border border-transparent bg-white hover:border-orange-100 hover:bg-orange-50/30"
                          }`}
                        >
                          {/* Active left line */}
                          {isActive && (
                            <span className="absolute -left-3 top-5 bottom-5 w-2 rounded-full bg-pink-500" />
                          )}

                          {/* Icon */}
                          <div
                            className={`flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[23px] text-3xl transition-all ${
                              isActive
                                ? "bg-gradient-to-br from-pink-500 to-pink-700 text-white shadow-lg shadow-pink-500/25"
                                : "bg-gradient-to-br from-orange-50 to-orange-100/60 text-orange-500"
                            }`}
                          >
                            {item.icon}
                          </div>

                          {/* Text */}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-[24px] font-black tracking-tight ${
                                isActive
                                  ? "text-gray-800"
                                  : "text-gray-800"
                              }`}
                            >
                              {item.name}
                            </p>

                            <p className="mt-1 text-[17px] text-gray-500">
                              {item.description}
                            </p>
                          </div>

                          {/* Right indicator */}
                          {isActive ? (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-pink-500 text-[12px] text-pink-500">
                              ●
                            </span>
                          ) : (
                            <span className="shrink-0 text-[42px] font-light leading-none text-gray-400">
                              ›
                            </span>
                          )}
                        </Link>
                      );
                    })}

                    {/* =================================
                        MENU ADMIN
                    ================================== */}
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex min-h-[98px] items-center gap-5 rounded-[28px] border border-pink-200 bg-gradient-to-r from-white via-pink-50/50 to-pink-50 px-4 py-4 transition hover:bg-pink-50"
                    >
                      <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[23px] bg-white text-3xl shadow-sm">
                        🏪
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[24px] font-black tracking-tight text-gray-800">
                          Menu Admin
                        </p>
                      </div>

                      <span className="shrink-0 text-[42px] font-light leading-none text-gray-400">
                        ›
                      </span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="my-8 h-px bg-gray-300" />

                  {/* =================================
                      LOGOUT
                  ================================== */}
                  <Link
                    href="/pos/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex min-h-[78px] w-full items-center justify-center gap-5 rounded-[25px] bg-gradient-to-r from-[#3a2118] via-[#4b2b20] to-[#321b15] px-6 text-[25px] font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98]"
                  >
                    <span className="text-4xl font-light">
                      ⇥
                    </span>

                    Keluar dari POS
                  </Link>

                  {/* Version */}
                  <div className="flex items-center justify-center gap-3 py-9 text-[15px] font-medium tracking-wide text-gray-500">
                    <span className="text-2xl text-pink-500">
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

            {/* =====================================
                PAGE CONTENT
            ====================================== */}
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>

          {/* =====================================
              MOBILE BOTTOM NAVIGATION
          ====================================== */}
          <MobileBottomNav />
        </div>
      </MobileCartProvider>
    </CartProvider>
  );
}