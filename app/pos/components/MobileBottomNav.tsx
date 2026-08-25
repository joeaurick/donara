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
    color: "pink",
  },
  {
    title: "Riwayat",
    href: "/pos/history",
    icon: ClipboardList,
    color: "purple",
  },
  {
    title: "Laporan",
    href: "/pos/report",
    icon: BarChart3,
    color: "blue",
  },
  {
    title: "Reminder",
    href: "/pos/reminder",
    icon: BellRing,
    color: "yellow",
  },
  {
    title: "Menu",
    href: "/pos/settings",
    icon: Settings,
    color: "green",
  },
];

const menuColors = {
  pink: {
    activeBg: "bg-[#fff0f4] border-[#ffd6e2]",
    icon: "bg-[#ff5c86] text-white shadow-[0_6px_16px_rgba(255,92,134,0.28)]",
    inactiveIcon: "bg-[#ffeaf0] text-[#ff4778]",
    text: "text-[#ff4778]",
    indicator: "bg-[#ff5c86]",
  },

  purple: {
    activeBg: "bg-[#f5f1ff] border-[#e7ddff]",
    icon: "bg-[#8b5cf6] text-white shadow-[0_6px_16px_rgba(139,92,246,0.25)]",
    inactiveIcon: "bg-[#eee7ff] text-[#7c3aed]",
    text: "text-[#7c3aed]",
    indicator: "bg-[#8b5cf6]",
  },

  blue: {
    activeBg: "bg-[#eef8ff] border-[#d7efff]",
    icon: "bg-[#35a7ff] text-white shadow-[0_6px_16px_rgba(53,167,255,0.25)]",
    inactiveIcon: "bg-[#e2f3ff] text-[#1689df]",
    text: "text-[#1689df]",
    indicator: "bg-[#35a7ff]",
  },

  yellow: {
    activeBg: "bg-[#fff9e8] border-[#ffedb7]",
    icon: "bg-[#ffb703] text-[#3d2a0b] shadow-[0_6px_16px_rgba(255,183,3,0.24)]",
    inactiveIcon: "bg-[#fff3cf] text-[#d99100]",
    text: "text-[#c98200]",
    indicator: "bg-[#ffb703]",
  },

  green: {
    activeBg: "bg-[#edfff9] border-[#d2f8ec]",
    icon: "bg-[#2ec4a6] text-white shadow-[0_6px_16px_rgba(46,196,166,0.24)]",
    inactiveIcon: "bg-[#dcfff6] text-[#159b7d]",
    text: "text-[#159b7d]",
    indicator: "bg-[#2ec4a6]",
  },
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 xl:hidden">
      <div className="mx-auto w-full max-w-lg rounded-[26px] border border-[#eaded7] bg-[#fffaf5]/95 p-1.5 shadow-[0_-8px_30px_rgba(45,27,22,0.10)] backdrop-blur-xl">
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

            const colors =
              menuColors[
                menu.color as keyof typeof menuColors
              ];

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="flex flex-1 items-center justify-center"
              >
                <div
                  className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[18px] px-1 py-2 transition-all duration-200 ${
                    active
                      ? `border ${colors.activeBg}`
                      : "border border-transparent"
                  }`}
                >
                  {/* ACTIVE BACKGROUND GLOW */}
                  {active && (
                    <span className="absolute inset-0 rounded-[18px] bg-white/35" />
                  )}

                  {/* ICON */}
                  <span
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                      active
                        ? `${colors.icon} scale-100`
                        : `${colors.inactiveIcon} scale-95`
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={
                        active ? 2.6 : 2.2
                      }
                    />
                  </span>

                  {/* TITLE */}
                  <span
                    className={`relative z-10 max-w-full truncate text-[8px] font-bold transition-all duration-200 sm:text-[9px] ${
                      active
                        ? colors.text
                        : "text-[#9b8880]"
                    }`}
                  >
                    {menu.title}
                  </span>

                  {/* ACTIVE INDICATOR */}
                  <span
                    className={`relative z-10 h-1 rounded-full transition-all duration-300 ${
                      active
                        ? `w-4 ${colors.indicator}`
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