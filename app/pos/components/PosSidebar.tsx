"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  Store,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { getUserRole } from "@/lib/auth/getUserRole";

const menus = [
  {
    title: "Kasir",
    subtitle: "Transaksi & pesanan",
    href: "/pos",
    icon: LayoutDashboard,
    color: "pink",
    number: "01",
  },
  {
    title: "Riwayat",
    subtitle: "Transaksi sebelumnya",
    href: "/pos/history",
    icon: ClipboardList,
    color: "purple",
    number: "02",
  },
  {
    title: "Laporan",
    subtitle: "Penjualan toko",
    href: "/pos/report",
    icon: BarChart3,
    color: "blue",
    number: "03",
  },
  {
    title: "Reminder",
    subtitle: "Catatan & pengingat stok",
    href: "/pos/reminder",
    icon: Bell,
    color: "yellow",
    number: "04",
  },
  {
    title: "Pengaturan",
    subtitle: "Atur aplikasi",
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

export default function PosSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState("");

  // =========================
  // SIDEBAR STATE
  // =========================
  const [collapsed, setCollapsed] =
    useState(false);

  const [sidebarLoaded, setSidebarLoaded] =
    useState(false);

  // =========================
  // LOAD SAVED SIDEBAR STATE
  // =========================
  useEffect(() => {
    const savedSidebarState =
      localStorage.getItem(
        "donara-pos-sidebar-collapsed"
      );

    if (savedSidebarState !== null) {
      setCollapsed(
        savedSidebarState === "true"
      );
    }

    setSidebarLoaded(true);
  }, []);

  // =========================
  // SAVE SIDEBAR STATE
  // =========================
  useEffect(() => {
    if (!sidebarLoaded) {
      return;
    }

    localStorage.setItem(
      "donara-pos-sidebar-collapsed",
      String(collapsed)
    );
  }, [collapsed, sidebarLoaded]);

  // =========================
  // TOGGLE SIDEBAR
  // =========================
  function toggleSidebar() {
    setCollapsed((prev) => !prev);
  }

  // =========================
  // LOAD ROLE
  // =========================
  useEffect(() => {
    async function loadRole() {
      const userRole =
        await getUserRole();

      if (userRole) {
        setRole(userRole);
      }
    }

    loadRole();
  }, []);

  // =========================
  // LOGOUT
  // =========================
  async function logout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/pos/login");
    router.refresh();
  }

  return (
    <aside
      className={`relative flex h-screen shrink-0 flex-col overflow-hidden bg-[#2d1b16] transition-all duration-300 ease-out ${
        collapsed
          ? "w-[88px]"
          : "w-[300px]"
      }`}
    >
      {/* =========================
          BACKGROUND DECORATION
      ========================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border-[24px] border-pink-400/10" />

        <div className="absolute -left-20 top-[40%] h-52 w-52 rounded-full bg-orange-400/5 blur-3xl" />

        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="absolute right-5 top-[180px] h-10 w-2 rotate-[25deg] rounded-full bg-[#ffb703]/20" />

        <div className="absolute left-7 top-[330px] h-8 w-2 rotate-[45deg] rounded-full bg-[#ff6b93]/20" />
      </div>

      {/* =========================
          TOGGLE
      ========================== */}

      <button
        type="button"
        onClick={toggleSidebar}
        className="absolute right-[-15px] top-6 z-50 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#2d1b16] bg-[#ff5c86] text-white shadow-lg transition hover:scale-110 hover:bg-[#ff4778] active:scale-95"
        title={
          collapsed
            ? "Buka Sidebar"
            : "Tutup Sidebar"
        }
      >
        {collapsed ? (
          <ChevronRight
            size={17}
            strokeWidth={3}
          />
        ) : (
          <ChevronLeft
            size={17}
            strokeWidth={3}
          />
        )}
      </button>

      {/* =========================
          COMPACT HEADER
      ========================== */}

      <div
        className={`relative z-10 flex shrink-0 items-center ${
          collapsed
            ? "justify-center px-3 py-5"
            : "gap-3 px-5 py-5"
        }`}
      >
        {/* =========================
            LOGO BARU
        ========================== */}

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black shadow-[0_10px_25px_rgba(0,0,0,0.28)]">
          <Image
            src="/images/logo/logo-new.png"
            alt="DONARA Logo"
            width={44}
            height={44}
            priority
            className="h-full w-full object-contain"
          />

          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#2d1b16] bg-[#ffb703]" />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-[18px] font-black tracking-tight text-white">
              DONARA
            </h1>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#46e6b4]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/45">
                POS Online
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =========================
          RECEIPT CONTAINER
      ========================== */}

      <div
        className={`relative z-10 mx-3 flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fffaf5] shadow-[0_18px_40px_rgba(0,0,0,0.18)] ${
          collapsed
            ? "rounded-[24px]"
            : "rounded-t-[30px]"
        }`}
      >
        {/* RECEIPT TOP */}

        <div className="relative px-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-[#eaded7]" />

            {!collapsed && (
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#aa9288]">
                Donara Menu
              </span>
            )}

            <span className="h-px flex-1 bg-[#eaded7]" />
          </div>
        </div>

        {/* MENU */}

        <nav
          className={`flex-1 overflow-y-auto py-4 ${
            collapsed
              ? "px-2"
              : "px-3"
          }`}
        >
          <div className="space-y-2">
            {menus
              .filter((menu) => {
                if (role === "cashier") {
                  return ![
                    "/pos/report",
                    "/pos/settings",
                  ].includes(menu.href);
                }

                return true;
              })
              .map((menu) => {
                const active =
                  menu.href === "/pos"
                    ? pathname === "/pos" ||
                      pathname ===
                        "/pos/dashboard"
                    : pathname.startsWith(
                        menu.href
                      );

                const Icon = menu.icon;

                const colors =
                  menuColors[
                    menu.color as keyof typeof menuColors
                  ];

                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    title={
                      collapsed
                        ? menu.title
                        : undefined
                    }
                    className={`group relative flex overflow-hidden transition-all duration-200 ${
                      collapsed
                        ? "justify-center rounded-[18px] p-2"
                        : "items-center gap-3 rounded-[18px] px-2.5 py-2.5"
                    } ${
                      active
                        ? `${colors.active} shadow-[0_10px_22px_rgba(45,27,22,0.12)]`
                        : "text-[#5f5049] hover:bg-[#f7eee9]"
                    }`}
                  >
                    {/* MENU NUMBER */}

                    {!collapsed && (
                      <span
                        className={`w-5 shrink-0 text-[8px] font-black ${
                          active
                            ? "text-white/50"
                            : colors.number
                        }`}
                      >
                        {menu.number}
                      </span>
                    )}

                    {/* ICON */}

                    <span
                      className={`relative flex shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                        collapsed
                          ? "h-12 w-12"
                          : "h-10 w-10"
                      } ${
                        active
                          ? colors.activeIcon
                          : colors.icon
                      }`}
                    >
                      <Icon
                        size={19}
                        strokeWidth={
                          active ? 2.6 : 2.3
                        }
                      />
                    </span>

                    {/* TEXT */}

                    {!collapsed && (
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-black">
                          {menu.title}
                        </span>

                        <span
                          className={`mt-0.5 block truncate text-[9px] font-medium ${
                            active
                              ? "text-white/70"
                              : "text-[#a18f87]"
                          }`}
                        >
                          {menu.subtitle}
                        </span>
                      </span>
                    )}

                    {/* ACTIVE DOT */}

                    {!collapsed &&
                      active && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-white shadow-sm" />
                      )}

                    {/* HOVER MARK */}

                    {!collapsed &&
                      !active && (
                        <span
                          className={`absolute bottom-0 left-4 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-[calc(100%-32px)] ${colors.line}`}
                        />
                      )}
                  </Link>
                );
              })}
          </div>
        </nav>

        {/* =========================
            RECEIPT FOOTER
        ========================== */}

        <div
          className={`border-t border-dashed border-[#eaded7] ${
            collapsed
              ? "p-2"
              : "p-3"
          }`}
        >
          {/* ADMIN */}

          <Link
            href="/admin"
            title={
              collapsed
                ? "Menu Admin"
                : undefined
            }
            className={`group mb-2 flex items-center rounded-[16px] bg-[#f5efff] text-[#5d3fa3] transition hover:-translate-y-[1px] hover:shadow-md ${
              collapsed
                ? "justify-center p-2.5"
                : "justify-between px-3 py-2.5"
            }`}
          >
            <span
              className={`flex items-center ${
                collapsed
                  ? ""
                  : "gap-2"
              }`}
            >
              <Store
                size={17}
                strokeWidth={2.5}
              />

              {!collapsed && (
                <span className="text-[11px] font-black">
                  Menu Admin
                </span>
              )}
            </span>

            {!collapsed && (
              <span className="text-sm">
                →
              </span>
            )}
          </Link>

          {/* LOGOUT */}

          <button
            type="button"
            onClick={logout}
            title={
              collapsed
                ? "Keluar dari POS"
                : undefined
            }
            className={`flex w-full items-center rounded-[16px] bg-[#2d1b16] text-white transition hover:bg-[#452820] active:scale-[0.98] ${
              collapsed
                ? "justify-center p-2.5"
                : "justify-center gap-2 px-3 py-3"
            }`}
          >
            <LogOut
              size={17}
              strokeWidth={2.5}
            />

            {!collapsed && (
              <span className="text-[11px] font-black">
                Keluar dari POS
              </span>
            )}
          </button>
        </div>
      </div>

      {/* =========================
          BOTTOM BRAND
      ========================== */}

      {!collapsed && (
        <div className="relative z-10 flex items-center justify-center gap-2 px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c86]" />

          <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/35">
            Donara POS
          </span>

          <span className="text-[8px] text-white/20">
            v1.0
          </span>
        </div>
      )}
    </aside>
  );
}