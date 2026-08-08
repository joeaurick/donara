"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { getUserRole } from "@/lib/auth/getUserRole";

const menus = [
  {
    title: "Dashboard",
    href: "/pos/dashboard",
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
    <aside className="flex h-screen w-72 flex-col border-r border-pink-100 bg-white shadow-sm">
      {/* Logo */}
      <div className="shrink-0 border-b border-pink-100 p-6">
        <h1 className="text-2xl font-black tracking-tight text-pink-600">
          DONARA POS
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Point of Sale
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
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
                pathname === menu.href ||
                pathname.startsWith(menu.href + "/");

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-pink-600 text-white shadow-lg shadow-pink-200"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <span className="text-lg">
                    {menu.icon}
                  </span>

                  <span>
                    {menu.title}
                  </span>
                </Link>
              );
            })}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="shrink-0 border-t border-pink-100 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}