"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CircleDot,
  ClipboardList,
  Donut,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
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
  },
  {
    title: "Riwayat",
    subtitle: "Transaksi sebelumnya",
    href: "/pos/history",
    icon: ClipboardList,
  },
  {
    title: "Laporan",
    subtitle: "Penjualan toko",
    href: "/pos/report",
    icon: BarChart3,
  },
  {
    title: "Pengaturan",
    subtitle: "Atur aplikasi",
    href: "/pos/settings",
    icon: Settings,
  },
];

export default function PosSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [role, setRole] = useState("");

  useEffect(() => {
    async function loadRole() {
      const userRole = await getUserRole();

      if (userRole) {
        setRole(userRole);
      }
    }

    loadRole();
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
    <aside className="relative flex h-screen w-[280px] flex-col overflow-hidden border-r border-orange-100 bg-[#fffaf5]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-16 top-32 h-40 w-40 rounded-full bg-pink-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-32 h-48 w-48 rounded-full bg-orange-100/70 blur-3xl" />

      {/* ================= BRAND ================= */}
      <div className="relative px-5 pb-5 pt-6">
        <div className="relative overflow-hidden rounded-[28px] bg-[#2d1b16] p-5 text-white shadow-[0_16px_35px_rgba(45,27,22,0.18)]">
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[16px] border-pink-400/20" />
          <div className="absolute -bottom-10 right-10 h-20 w-20 rounded-full bg-orange-300/10" />

          <div className="relative flex items-center gap-3">
            {/* Donut logo */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-950/20">
              <Donut
                size={28}
                strokeWidth={2.5}
                className="text-white"
              />

              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-orange-300 ring-2 ring-[#2d1b16]" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight">
                DONARA
              </h1>

              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-pink-200">
                Point of Sale
              </p>
            </div>
          </div>

          <div className="relative mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-50" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>

            <span className="text-xs font-semibold text-orange-50">
              Toko sedang operasional
            </span>
          </div>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <nav className="relative flex-1 overflow-y-auto px-4 py-3">
        <div className="mb-3 flex items-center gap-2 px-2">
          <span className="h-px flex-1 bg-orange-100" />

          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-300">
            Menu Utama
          </p>

          <span className="h-px flex-1 bg-orange-100" />
        </div>

        <div className="space-y-2">
          {menus
            .filter((menu) => {
              if (role === "cashier") {
                return !["/pos/report", "/pos/settings"].includes(
                  menu.href
                );
              }

              return true;
            })
            .map((menu) => {
              const active =
                menu.href === "/pos"
                  ? pathname === "/pos" ||
                    pathname === "/pos/dashboard"
                  : pathname.startsWith(menu.href);

              const Icon = menu.icon;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`group relative flex items-center gap-3 rounded-2xl p-3 transition-all duration-200 ${
                    active
                      ? "bg-white text-[#2d1b16] shadow-[0_10px_25px_rgba(244,114,182,0.12)] ring-1 ring-pink-100"
                      : "text-stone-500 hover:bg-white/80 hover:text-[#2d1b16]"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-gradient-to-b from-pink-500 to-orange-400" />
                  )}

                  {/* Icon */}
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200/70"
                        : "bg-orange-50 text-orange-400 group-hover:bg-pink-50 group-hover:text-pink-500"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2.3} />
                  </span>

                  {/* Text */}
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-black ${
                        active
                          ? "text-[#2d1b16]"
                          : "text-stone-600 group-hover:text-[#2d1b16]"
                      }`}
                    >
                      {menu.title}
                    </span>

                    <span className="mt-0.5 block truncate text-[10px] font-medium text-stone-400">
                      {menu.subtitle}
                    </span>
                  </span>

                  {/* Active dot */}
                  {active && (
                    <CircleDot
                      size={17}
                      strokeWidth={2.5}
                      className="shrink-0 text-pink-500"
                    />
                  )}
                </Link>
              );
            })}
        </div>
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="relative px-4 pb-5 pt-3">
        <div className="rounded-[26px] border border-orange-100 bg-white/90 p-3 shadow-[0_10px_30px_rgba(120,53,15,0.06)] backdrop-blur-sm">
          {/* Role */}
          

          {/* Admin */}
          <Link
            href="/admin"
            className="mb-2 flex w-full items-center justify-between rounded-xl border border-orange-100 bg-white px-3 py-3 text-sm font-bold text-[#2d1b16] transition hover:border-pink-200 hover:bg-pink-50 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <Store size={17} strokeWidth={2.4} />
              </span>

              Menu Admin
            </span>

            <span className="text-xs text-stone-300">→</span>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2d1b16] px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-950/10 transition hover:bg-[#452820] active:scale-[0.98]"
          >
            <LogOut size={17} strokeWidth={2.5} />
            Keluar dari POS
          </button>
        </div>

        {/* Version */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] font-bold tracking-wide text-stone-400">
          <Donut size={11} className="text-pink-400" />
          DONARA POS
          <span className="text-stone-300">•</span>
          v1.0
        </div>
      </div>
    </aside>
  );
}