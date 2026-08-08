"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import { getUserRole } from "@/lib/auth/getUserRole";

const menus = [
  {
    title: "Dashboard",
    href: "/pos",
    icon: "🏠",
  },
  {
    title: "History",
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
    <aside className="flex h-screen w-[280px] flex-col border-r border-pink-100 bg-white shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="border-b border-pink-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-lg font-black text-white shadow-lg shadow-pink-500/20">
            D
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-black tracking-tight text-gray-900">
              DONARA POS
            </h1>

            <p className="text-xs font-medium text-gray-400">
              Point of Sale
            </p>
          </div>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
          Navigasi
        </p>

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
                  ? pathname === "/pos" || pathname === "/pos/dashboard"
                  : pathname.startsWith(menu.href);

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all ${
                      active
                        ? "bg-white/15"
                        : "bg-gray-100 group-hover:bg-pink-100"
                    }`}
                  >
                    {menu.icon}
                  </div>

                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <span className="truncate text-sm font-semibold">
                      {menu.title}
                    </span>

                    {active && (
                      <div className="h-2 w-2 rounded-full bg-white shadow-sm" />
                    )}
                  </div>
                </Link>
              );
            })}
        </div>
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="border-t border-gray-100 p-4">
        {/* Status */}
        

        {/* Kembali ke Admin */}
        <Link
          href="/admin"
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm font-bold text-pink-600 transition-all duration-200 hover:bg-pink-100 active:scale-[0.98]"
        >
          <span className="text-base">🏢</span>
          Menu Admin
        </Link>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-all duration-200 hover:border-red-200 hover:bg-red-100 active:scale-[0.98]"
        >
          <span className="text-base">🚪</span>
          Logout
        </button>

        <div className="mt-4 text-center text-[10px] font-medium text-gray-400">
          Donara POS • v1.0
        </div>
      </div>
    </aside>
  );
}