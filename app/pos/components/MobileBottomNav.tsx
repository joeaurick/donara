"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    title: "Menu",
    href: "/pos/settings",
    icon: "⚙️",
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pink-100 bg-white/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-4">
        {menus.map((menu) => {
          const active =
            pathname === menu.href ||
            pathname.startsWith(menu.href + "/");

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold transition-all duration-200 ${
                active
                  ? "text-pink-600"
                  : "text-gray-500 hover:text-pink-500"
              }`}
            >
              <span
                className={`text-xl transition-transform ${
                  active ? "scale-110" : ""
                }`}
              >
                {menu.icon}
              </span>

              <span>
                {menu.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}