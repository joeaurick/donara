"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogout from "@/app/components/AdminLogout";

const menus = [
  {
    href: "/admin",
    icon: "🏠",
    title: "Dashboard",
  },
  {
    href: "/admin/products",
    icon: "🍩",
    title: "Produk",
  },
  {
    href: "/admin/gallery",
    icon: "🖼️",
    title: "Gallery",
  },
  {
    href: "/admin/reviews",
    icon: "⭐",
    title: "Review",
  },
  {
    href: "/admin/seo",
    icon: "🌐",
    title: "SEO",
  },
  {
    href: "/admin/business",
    icon: "🏢",
    title: "Business",
  },
  {
    href: "/admin/homepage",
    icon: "🏡",
    title: "Homepage",
  },
];

export default function SidebarMenu() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">

      <div className="flex-1 space-y-2">

        {menus.map((menu) => {

          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 ${
                active
                  ? "bg-pink-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-pink-100"
              }`}
            >
              <span className="text-2xl">
                {menu.icon}
              </span>

              <span className="font-semibold">
                {menu.title}
              </span>

              {active && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white" />
              )}

            </Link>
          );
        })}

      </div>

      <div className="mt-6 border-t border-pink-100 pt-6">

        <AdminLogout />

      </div>

    </div>
  );
}