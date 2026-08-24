"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  BarChart3,
  Bell,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Store,
  X,
} from "lucide-react";

import PosSidebar from "./components/PosSidebar";
import MobileBottomNav from "./components/MobileBottomNav";

import { CartProvider } from "./context/CartContext";
import { MobileCartProvider } from "./context/MobileCartContext";

import { isTodayClosed } from "@/lib/supabase/daily-stock";

const menuItems = [
  {
    name: "Kasir",
    description: "Transaksi & pesanan",
    href: "/pos",
    icon: LayoutDashboard,
    color: "pink",
    number: "01",
  },
  {
    name: "Riwayat",
    description: "Transaksi sebelumnya",
    href: "/pos/history",
    icon: ClipboardList,
    color: "purple",
    number: "02",
  },
  {
    name: "Laporan",
    description: "Ringkasan penjualan",
    href: "/pos/report",
    icon: BarChart3,
    color: "blue",
    number: "03",
  },
  {
    name: "Reminder",
    description: "Catatan dan pengingat",
    href: "/pos/reminder",
    icon: Bell,
    color: "yellow",
    number: "04",
  },
  {
    name: "Pengaturan",
    description: "Atur POS",
    href: "/pos/settings",
    icon: Settings,
    color: "green",
    number: "05",
  },
];

const menuColors = {
  pink: {
    active: "bg-[#ff5c86] text-white",
    icon: "bg-[#ffe1e9] text-[#ff4778]",
    activeIcon: "bg-white/20 text-white",
    number: "text-[#ff4778]",
    line: "bg-[#ff5c86]",
  },
  purple: {
    active: "bg-[#8b5cf6] text-white",
    icon: "bg-[#eee7ff] text-[#7c3aed]",
    activeIcon: "bg-white/20 text-white",
    number: "text-[#8b5cf6]",
    line: "bg-[#8b5cf6]",
  },
  blue: {
    active: "bg-[#35a7ff] text-white",
    icon: "bg-[#e2f3ff] text-[#1689df]",
    activeIcon: "bg-white/20 text-white",
    number: "text-[#1689df]",
    line: "bg-[#35a7ff]",
  },
  yellow: {
    active: "bg-[#ffb703] text-[#3d2a0b]",
    icon: "bg-[#fff3cf] text-[#d99100]",
    activeIcon: "bg-white/30 text-[#3d2a0b]",
    number: "text-[#d99100]",
    line: "bg-[#ffb703]",
  },
  green: {
    active: "bg-[#2ec4a6] text-white",
    icon: "bg-[#dcfff6] text-[#159b7d]",
    activeIcon: "bg-white/20 text-white",
    number: "text-[#159b7d]",
    line: "bg-[#2ec4a6]",
  },
};

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
        const closed =
          await isTodayClosed();

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
            <div className="sticky top-0 z-[40] flex items-center justify-between border-b border-[#eaded7] bg-[#fffaf5]/95 px-4 py-3 shadow-sm backdrop-blur-xl lg:hidden">
              <div className="flex items-center gap-2.5">
                {/* LOGO */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#2d1b16] shadow-[0_8px_20px_rgba(45,27,22,0.18)]">
                  <Image
                    src="/images/logo/logo-new.png"
                    alt="DONARA Logo"
                    width={44}
                    height={44}
                    unoptimized
                    className="h-full w-full object-contain p-1.5"
                    priority
                  />
                </div>

                <div>
                  <p className="text-[16px] font-black tracking-tight text-[#2d1b16]">
                    DONARA
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        storeClosed
                          ? "bg-red-500"
                          : "bg-[#46e6b4]"
                      }`}
                    />

                    <p
                      className={`text-[8px] font-bold uppercase tracking-[0.12em] ${
                        storeClosed
                          ? "text-red-500"
                          : "text-[#8c7a72]"
                      }`}
                    >
                      {storeClosed
                        ? "Toko Tutup"
                        : "POS Online"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsMenuOpen(!isMenuOpen)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2d1b16] text-white shadow-[0_8px_20px_rgba(45,27,22,0.18)] transition active:scale-95"
                aria-label="Buka menu"
              >
                {isMenuOpen ? (
                  <X
                    size={20}
                    strokeWidth={2.8}
                  />
                ) : (
                  <span className="relative flex h-4 w-5 flex-col justify-between">
                    <span className="h-[2px] w-full rounded-full bg-white" />

                    <span className="h-[2px] w-4 self-end rounded-full bg-[#ffb703]" />

                    <span className="h-[2px] w-full rounded-full bg-white" />
                  </span>
                )}
              </button>
            </div>

            {/* =========================
                OVERLAY MOBILE
            ========================== */}
            {isMenuOpen && (
              <div
                onClick={() =>
                  setIsMenuOpen(false)
                }
                className="fixed inset-0 z-[190] bg-black/45 backdrop-blur-[3px] lg:hidden"
              />
            )}

            {/* =========================
                MOBILE SIDEBAR
            ========================== */}
            <aside
              className={`fixed bottom-0 left-0 top-0 z-[200] flex h-dvh w-[86vw] max-w-[340px] flex-col overflow-hidden bg-[#2d1b16] shadow-[16px_0_50px_rgba(0,0,0,0.28)] transition-transform duration-300 ease-out lg:hidden ${
                isMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full"
              }`}
            >
              {/* =========================
                  BACKGROUND DECORATION
              ========================== */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border-[24px] border-pink-400/10" />

                <div className="absolute -left-20 top-[38%] h-52 w-52 rounded-full bg-orange-400/5 blur-3xl" />

                <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl" />

                <div className="absolute right-5 top-[190px] h-10 w-2 rotate-[25deg] rounded-full bg-[#ffb703]/20" />

                <div className="absolute left-7 top-[360px] h-8 w-2 rotate-[45deg] rounded-full bg-[#ff6b93]/20" />
              </div>

              {/* =========================
                  MOBILE BRAND HEADER
              ========================== */}
              <div className="relative z-10 flex shrink-0 items-center gap-3 px-5 py-5">
                {/* LOGO ASLI */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-white/10 bg-gradient-to-br from-[#4a2920] via-[#2d1b16] to-[#1d100d] shadow-[0_10px_25px_rgba(0,0,0,0.28)]">
  <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-pink-500/20 blur-md" />

  <div className="absolute -bottom-3 -left-3 h-8 w-8 rounded-full bg-orange-400/15 blur-md" />

  <Image
    src="/images/logo/logo-new.png"
    alt="DONARA Logo"
    width={32}
    height={32}
    className="relative z-10 object-contain"
    priority
  />
</div>

                {/* BRAND */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-[19px] font-black tracking-tight text-white">
                    DONARA
                  </h1>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {!storeClosed && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#46e6b4] opacity-60" />
                      )}

                      <span
                        className={`relative inline-flex h-2 w-2 rounded-full ${
                          storeClosed
                            ? "bg-red-400"
                            : "bg-[#46e6b4]"
                        }`}
                      />
                    </span>

                    <span
                      className={`text-[8px] font-bold uppercase tracking-[0.14em] ${
                        storeClosed
                          ? "text-red-300"
                          : "text-white/45"
                      }`}
                    >
                      {storeClosed
                        ? "Toko sedang tutup"
                        : "POS Online"}
                    </span>
                  </div>
                </div>

                {/* CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    setIsMenuOpen(false)
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/80 transition hover:bg-white/15 active:scale-95"
                  aria-label="Tutup menu"
                >
                  <X
                    size={18}
                    strokeWidth={2.5}
                  />
                </button>
              </div>

              {/* =========================
                  RECEIPT CONTAINER
              ========================== */}
              <div className="relative z-10 mx-3 mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[30px] bg-[#fffaf5] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                {/* =========================
                    RECEIPT HEADER
                ========================== */}
                <div className="relative px-4 pt-5">
                  <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-[#eaded7]" />

                    <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.2em] text-[#aa9288]">
                      Donara Menu
                    </span>

                    <span className="h-px flex-1 bg-[#eaded7]" />
                  </div>
                </div>

                {/* =========================
                    MENU NAVIGATION
                ========================== */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                  <div className="space-y-2">
                    {menuItems.map((item) => {
                      const isActive =
                        item.href === "/pos"
                          ? pathname === "/pos" ||
                            pathname ===
                              "/pos/dashboard"
                          : pathname === item.href ||
                            pathname.startsWith(
                              item.href + "/"
                            );

                      const Icon = item.icon;

                      const colors =
                        menuColors[
                          item.color as keyof typeof menuColors
                        ];

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() =>
                            setIsMenuOpen(false)
                          }
                          className={`group relative flex min-h-[58px] items-center gap-3 overflow-hidden rounded-[18px] px-2.5 py-2.5 transition-all duration-200 ${
                            isActive
                              ? `${colors.active} shadow-[0_10px_22px_rgba(45,27,22,0.12)]`
                              : "text-[#5f5049] hover:bg-[#f7eee9]"
                          }`}
                        >
                          {/* MENU NUMBER */}
                          <span
                            className={`w-5 shrink-0 text-[8px] font-black ${
                              isActive
                                ? "text-white/50"
                                : colors.number
                            }`}
                          >
                            {item.number}
                          </span>

                          {/* ICON */}
                          <span
                            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                              isActive
                                ? colors.activeIcon
                                : colors.icon
                            }`}
                          >
                            <Icon
                              size={19}
                              strokeWidth={
                                isActive ? 2.6 : 2.3
                              }
                            />
                          </span>

                          {/* TEXT */}
                          <span className="min-w-0 flex-1">
                            <span className="block text-[12px] font-black">
                              {item.name}
                            </span>

                            <span
                              className={`mt-0.5 block truncate text-[9px] font-medium ${
                                isActive
                                  ? "text-white/70"
                                  : "text-[#a18f87]"
                              }`}
                            >
                              {item.description}
                            </span>
                          </span>

                          {/* ACTIVE DOT */}
                          {isActive && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-white shadow-sm" />
                          )}

                          {/* ARROW */}
                          {!isActive && (
                            <span className="shrink-0 text-base font-light text-[#b9a79f]">
                              ›
                            </span>
                          )}

                          {/* HOVER LINE */}
                          {!isActive && (
                            <span
                              className={`absolute bottom-0 left-4 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-[calc(100%-32px)] ${colors.line}`}
                            />
                          )}
                        </Link>
                      );
                    })}

                    {/* =========================
                        MENU ADMIN
                    ========================== */}
                    <Link
                      href="/admin"
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                      className="group flex min-h-[58px] items-center gap-3 rounded-[18px] bg-[#f5efff] px-3 py-2.5 text-[#5d3fa3] transition hover:-translate-y-[1px] hover:shadow-md"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80">
                        <Store
                          size={18}
                          strokeWidth={2.4}
                        />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-black">
                          Menu Admin
                        </span>

                        <span className="mt-0.5 block text-[9px] font-medium text-[#8d75bf]">
                          Kelola bisnis DONARA
                        </span>
                      </span>

                      <span className="text-base font-light">
                        →
                      </span>
                    </Link>
                  </div>
                </nav>

                {/* =========================
                    RECEIPT FOOTER
                ========================== */}
                <div className="border-t border-dashed border-[#eaded7] px-3 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c86]" />

                    <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#a18f87]">
                      Donara POS
                    </span>

                    <span className="text-[8px] text-[#c7b7af]">
                      •
                    </span>

                    <span className="text-[8px] text-[#c7b7af]">
                      v1.0
                    </span>
                  </div>
                </div>
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