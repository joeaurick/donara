"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import { getUserRole } from "@/lib/auth/getUserRole";

const menus = [
  {
    title: "Dashboard / Kasir",
    href: "/pos",
    icon: "🏠",
  },
  {
    title: "Riwayat Transaksi",
    href: "/pos/history",
    icon: "🧾",
  },
  {
    title: "Laporan",
    href: "/pos/report",
    icon: "📊",
  },
  {
    title: "Pengaturan",
    href: "/pos/settings",
    icon: "⚙️",
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
    <aside className="flex h-full flex-col overflow-hidden bg-white">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden border-b border-pink-100 bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500 px-5 py-6 text-white">
        {/* Glow Effect */}
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-xl font-black shadow-lg backdrop-blur-md">
            D
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-black tracking-tight">
              CUSTOMPOS
            </h1>

            <p className="text-xs font-medium text-pink-100">
              Donara Point of Sale
            </p>
          </div>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mb-4 px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
            Menu Navigasi
          </p>
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

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/25"
                      : "text-slate-600 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-base transition-all ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-pink-100 group-hover:text-pink-600"
                    }`}
                  >
                    {menu.icon}
                  </span>

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">
                      {menu.title}
                    </span>

                    {active && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-white shadow-sm" />
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="border-t border-slate-100 bg-slate-50/80 p-4">
        {/* Status */}
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
                Operasional
              </p>
            </div>
          </div>
        </div>

        {/* Menu Admin */}
        <Link
          href="/admin"
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-600 shadow-sm transition hover:bg-pink-50 active:scale-[0.98]"
        >
          <span className="text-base">🏪</span>
          Menu Admin
        </Link>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 transition hover:from-red-600 hover:to-rose-600 active:scale-[0.98]"
        >
          <span className="text-base">🚪</span>
          Logout
        </button>

        <div className="mt-4 text-center text-[10px] font-medium text-slate-400">
          CUSTOMPOS • v1.0
        </div>
      </div>
    </aside>
  );
}