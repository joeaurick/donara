"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Globe,
  House,
  Images,
  LayoutDashboard,
  MessageSquare,
  Package,
  Rocket,
} from "lucide-react";

const menus = [
  {
    href: "/pos/dashboard",
    icon: Rocket,
    title: "Mulai Penjualan",
    description: "Buka halaman kasir",
    badge: "POS",
  },
  {
    href: "/admin",
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Ringkasan bisnis",
  },
  {
    href: "/admin/products",
    icon: Package,
    title: "Produk",
    description: "Kelola produk",
  },
  {
    href: "/admin/gallery",
    icon: Images,
    title: "Gallery",
    description: "Kelola gallery",
  },
  {
    href: "/admin/reviews",
    icon: MessageSquare,
    title: "Review",
    description: "Review pelanggan",
  },
  {
    href: "/admin/seo",
    icon: Globe,
    title: "SEO",
    description: "Optimasi website",
  },
  {
    href: "/admin/business",
    icon: Building2,
    title: "Business",
    description: "Informasi bisnis",
  },
  {
    href: "/admin/homepage",
    icon: House,
    title: "Homepage",
    description: "Atur halaman utama",
  },
];

type Props = {
  onNavigate?: () => void;
};

export default function SidebarMenu({
  onNavigate,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="space-y-2">
      {menus.map((menu) => {
        const active =
          menu.href === "/admin"
            ? pathname === "/admin"
            : pathname === menu.href ||
              pathname.startsWith(
                `${menu.href}/`
              );

        const isPos =
          menu.href === "/pos/dashboard";

        const Icon = menu.icon;

        return (
          <Link
            key={menu.href}
            href={menu.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 ${
              active
                ? "border border-pink-200 bg-gradient-to-r from-pink-50 via-white to-pink-50 shadow-[0_8px_20px_rgba(236,72,153,0.10)]"
                : isPos
                  ? "border border-orange-100 bg-orange-50/70 hover:bg-orange-50"
                  : "border border-transparent bg-white/50 hover:border-orange-100 hover:bg-orange-50/40"
            }`}
          >
            {/* ACTIVE LEFT LINE */}
            {active && (
              <span className="absolute bottom-2.5 left-0 top-2.5 w-1 rounded-r-full bg-pink-500" />
            )}

            {/* ICON */}
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                active
                  ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md shadow-pink-500/25"
                  : isPos
                    ? "bg-orange-100 text-orange-600"
                    : "bg-orange-50 text-orange-500 group-hover:bg-pink-100 group-hover:text-pink-600"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>

            {/* TEXT */}
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-sm font-black ${
                  active
                    ? "text-slate-800"
                    : isPos
                      ? "text-orange-800"
                      : "text-slate-700"
                }`}
              >
                {menu.title}
              </p>

              <p className="mt-0.5 truncate text-[9px] text-slate-400">
                {menu.description}
              </p>
            </div>

            {/* POS BADGE */}
            {menu.badge && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                  active
                    ? "bg-pink-100 text-pink-600"
                    : "bg-orange-200/70 text-orange-700"
                }`}
              >
                {menu.badge}
              </span>
            )}

            {/* RIGHT INDICATOR */}
            {active ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-pink-400 text-[8px] text-pink-500">
                ●
              </span>
            ) : (
              <span className="shrink-0 text-lg leading-none text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-pink-500">
                ›
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}