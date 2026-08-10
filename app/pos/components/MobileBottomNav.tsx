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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(15,23,42,0.08)] xl:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2 pb-safe">
        {menus.map((menu) => {
          const active =
            pathname === menu.href ||
            pathname.startsWith(menu.href + "/");

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className="flex flex-1 items-center justify-center"
            >
              <div
                className={
                  active
                    ? "flex min-w-[72px] flex-col items-center justify-center gap-1 rounded-2xl bg-gradient-to-b from-pink-50 to-white px-3 py-2 text-pink-600 shadow-sm ring-1 ring-pink-100 transition-all duration-200"
                    : "flex min-w-[72px] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-slate-500 transition-all duration-200 hover:text-pink-500"
                }
              >
                <span
                  className={
                    active
                      ? "text-lg scale-110 transition-all duration-200"
                      : "text-lg transition-all duration-200"
                  }
                >
                  {menu.icon}
                </span>

                <span
                  className={
                    active
                      ? "text-[10px] font-bold tracking-wide text-pink-600"
                      : "text-[10px] font-bold tracking-wide text-slate-500"
                  }
                >
                  {menu.title}
                </span>

                {active && (
                  <span className="h-1 w-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}