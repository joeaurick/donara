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
    title: "POS",
    href: "/pos/dashboard",
    icon: "🛒",
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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white xl:hidden">

      <div className="grid grid-cols-5">

        {menus.map((menu) => {

          const active = pathname.startsWith(menu.href);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex flex-col items-center justify-center py-2 text-xs transition ${
                active
                  ? "text-pink-600 font-bold"
                  : "text-gray-500"
              }`}
            >
              <span className="text-xl">
                {menu.icon}
              </span>

              <span className="mt-1">
                {menu.title}
              </span>
            </Link>
          );

        })}

      </div>

    </div>
  );
}