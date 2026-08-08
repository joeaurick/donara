"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Images,
  MessageSquare,
  Globe,
  Building2,
  House,
} from "lucide-react";

const menus = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    href: "/admin/products",
    icon: Package,
    title: "Produk",
  },
  {
    href: "/admin/gallery",
    icon: Images,
    title: "Gallery",
  },
  {
    href: "/admin/reviews",
    icon: MessageSquare,
    title: "Review",
  },
  {
    href: "/admin/seo",
    icon: Globe,
    title: "SEO",
  },
  {
    href: "/admin/business",
    icon: Building2,
    title: "Business",
  },
  {
    href: "/admin/homepage",
    icon: House,
    title: "Homepage",
  },
];

type Props = {
  onNavigate?: () => void;
};

export default function SidebarMenu({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <div className="space-y-2">
      {menus.map((menu) => {
        // Dashboard hanya aktif saat tepat /admin
        // Menu lain aktif untuk semua sub-route
        const active =
          menu.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(menu.href);

        const Icon = menu.icon;

        return (
          <Link
            key={menu.href}
            href={menu.href}
            onClick={onNavigate}
            className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 ${
              active
                ? "bg-pink-600 text-white shadow-lg shadow-pink-500/20"
                : "text-gray-700 hover:bg-pink-100 hover:text-pink-600"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />

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
  );
}