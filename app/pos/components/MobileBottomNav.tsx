"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const menus = [
  {
    title: "Kasir",
    href: "/pos",
    icon: LayoutDashboard,
  },
  {
    title: "Riwayat",
    href: "/pos/history",
    icon: ClipboardList,
  },
  {
    title: "Laporan",
    href: "/pos/report",
    icon: BarChart3,
  },
  {
    title: "Menu",
    href: "/pos/settings",
    icon: Settings,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 xl:hidden">
      <div className="mx-auto max-w-lg rounded-[28px] border border-orange-100 bg-[#fffaf5]/95 p-2 shadow-[0_-4px_30px_rgba(120,53,15,0.10)] backdrop-blur-xl">
        <div className="flex items-center justify-around">
          {menus.map((menu) => {
            const active =
              menu.href === "/pos"
                ? pathname === "/pos" ||
                  pathname === "/pos/dashboard"
                : pathname === menu.href ||
                  pathname.startsWith(menu.href + "/");

            const Icon = menu.icon;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="flex flex-1 items-center justify-center"
              >
                <div
                  className={`relative flex w-full max-w-[82px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition-all duration-200 ${
                    active
                      ? "text-[#2d1b16]"
                      : "text-stone-400"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-2xl bg-white shadow-sm ring-1 ring-pink-100" />
                  )}

                  <span
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200/70"
                        : "text-stone-400"
                    }`}
                  >
                    <Icon
                      size={19}
                      strokeWidth={active ? 2.6 : 2.2}
                    />
                  </span>

                  <span
                    className={`relative z-10 text-[9px] font-black tracking-wide transition-colors ${
                      active
                        ? "text-[#2d1b16]"
                        : "text-stone-400"
                    }`}
                  >
                    {menu.title}
                  </span>

                  {active && (
                    <span className="relative z-10 h-1 w-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-400" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}