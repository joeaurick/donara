"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BellRing,
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
    title: "Reminder",
    href: "/pos/reminder",
    icon: BellRing,
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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pink-100/80 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_30px_rgba(45,27,22,0.08)] backdrop-blur-xl xl:hidden">
      <div className="mx-auto w-full max-w-lg">
        <div className="flex items-center justify-between">
          {menus.map((menu) => {
            const active =
              menu.href === "/pos"
                ? pathname === "/pos" ||
                  pathname === "/pos/dashboard"
                : pathname === menu.href ||
                  pathname.startsWith(
                    menu.href + "/"
                  );

            const Icon = menu.icon;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="flex flex-1 items-center justify-center"
              >
                <div
                  className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 transition-all duration-200 ${
                    active
                      ? "text-pink-600"
                      : "text-[#a18f87]"
                  }`}
                >
                  {/* ACTIVE BACKGROUND */}
                  {active && (
                    <span className="absolute inset-0 rounded-2xl border border-pink-100 bg-pink-50/80 shadow-[0_4px_14px_rgba(236,72,153,0.08)]" />
                  )}

                  {/* ICON */}
                  <span
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-pink-500 text-white shadow-[0_6px_16px_rgba(236,72,153,0.28)]"
                        : "bg-transparent text-[#a18f87]"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={
                        active ? 2.5 : 2.1
                      }
                    />
                  </span>

                  {/* TITLE */}
                  <span
                    className={`relative z-10 max-w-full truncate text-[8px] font-bold transition-colors sm:text-[9px] ${
                      active
                        ? "text-pink-600"
                        : "text-[#9b8880]"
                    }`}
                  >
                    {menu.title}
                  </span>

                  {/* ACTIVE INDICATOR */}
                  <span
                    className={`relative z-10 h-1 rounded-full transition-all duration-200 ${
                      active
                        ? "w-4 bg-pink-500"
                        : "w-1 bg-transparent"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}