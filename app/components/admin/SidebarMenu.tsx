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
  Tags,
  Sparkles,
} from "lucide-react";

const menus = [
  {
    title: "Mulai Penjualan",
    subtitle: "Buka halaman kasir",
    href: "/pos/dashboard",
    icon: Rocket,
    color: "pink",
    number: "01",
  },
  {
    title: "Dashboard",
    subtitle: "Ringkasan bisnis",
    href: "/admin",
    icon: LayoutDashboard,
    color: "purple",
    number: "02",
  },
  {
    title: "Produk",
    subtitle: "Kelola produk",
    href: "/admin/products",
    icon: Package,
    color: "blue",
    number: "03",
  },
  {
    title: "Kategori",
    subtitle: "Kelola kategori produk",
    href: "/admin/categories",
    icon: Tags,
    color: "yellow",
    number: "04",
  },
  {
    title: "Gallery",
    subtitle: "Kelola gallery",
    href: "/admin/gallery",
    icon: Images,
    color: "green",
    number: "05",
  },
  {
    title: "Review",
    subtitle: "Review pelanggan",
    href: "/admin/reviews",
    icon: MessageSquare,
    color: "pink",
    number: "06",
  },
  {
    title: "SEO",
    subtitle: "Optimasi website",
    href: "/admin/seo",
    icon: Globe,
    color: "purple",
    number: "07",
  },
  {
    title: "Business",
    subtitle: "Informasi bisnis",
    href: "/admin/business",
    icon: Building2,
    color: "blue",
    number: "08",
  },
  {
    title: "Homepage",
    subtitle: "Atur halaman utama",
    href: "/admin/homepage",
    icon: House,
    color: "green",
    number: "09",
  },

  {
    title: "Donara AI",
    subtitle: "Cari & analisis berita",
    href: "/admin/ai",
    icon: Sparkles,
    color: "ai",
    number: "10",
  },
];

const menuColors = {
  pink: {
    active: "bg-[#ff5c86] text-white",
    icon: "bg-[#ffe1e9] text-[#ff4778]",
    activeIcon: "bg-white/20 text-white",
    number: "text-[#ff4778]",
    line: "bg-[#ff5c86]",
  },

  purple: {
    active: "bg-[#8b5cf6] text-white",
    icon: "bg-[#eee7ff] text-[#7c3aed]",
    activeIcon: "bg-white/20 text-white",
    number: "text-[#8b5cf6]",
    line: "bg-[#8b5cf6]",
  },

  blue: {
    active: "bg-[#35a7ff] text-white",
    icon: "bg-[#e2f3ff] text-[#1689df]",
    activeIcon: "bg-white/20 text-white",
    number: "text-[#1689df]",
    line: "bg-[#35a7ff]",
  },

  yellow: {
    active: "bg-[#ffb703] text-[#3d2a0b]",
    icon: "bg-[#fff3cf] text-[#d99100]",
    activeIcon: "bg-white/30 text-[#3d2a0b]",
    number: "text-[#d99100]",
    line: "bg-[#ffb703]",
  },

  green: {
    active: "bg-[#2ec4a6] text-white",
    icon: "bg-[#dcfff6] text-[#159b7d]",
    activeIcon: "bg-white/20 text-white",
    number: "text-[#159b7d]",
    line: "bg-[#2ec4a6]",
  },

  ai: {
    active: "bg-[#2d1b16] text-[#fffaf5]",
    icon: "bg-[#f5e6d8] text-[#8a4f2a]",
    activeIcon: "bg-[#ffb703] text-[#2d1b16]",
    number: "text-[#a76438]",
    line: "bg-[#ffb703]",
  },
};

type Props = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export default function SidebarMenu({
  collapsed,
  onNavigate,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="space-y-2">
      {menus.map((menu) => {
        const active =
          menu.href === "/admin"
            ? pathname === "/admin"
            : menu.href === "/pos/dashboard"
              ? pathname === "/pos" ||
                pathname === "/pos/dashboard"
              : pathname === menu.href ||
                pathname.startsWith(`${menu.href}/`);

        const Icon = menu.icon;

        const colors =
          menuColors[
            menu.color as keyof typeof menuColors
          ];

        return (
          <Link
            key={menu.href}
            href={menu.href}
            onClick={onNavigate}
            title={collapsed ? menu.title : undefined}
            className={`group relative flex overflow-hidden transition-all duration-200 ${
              collapsed
                ? "justify-center rounded-[18px] p-2"
                : "items-center gap-3 rounded-[18px] px-2.5 py-2.5"
            } ${
              active
                ? `${colors.active} shadow-[0_10px_22px_rgba(45,27,22,0.12)]`
                : "text-[#5f5049] hover:bg-[#f7eee9]"
            }`}
          >
            {/* MENU NUMBER */}
            {!collapsed && (
              <span
                className={`w-5 shrink-0 text-[8px] font-black ${
                  active
                    ? "text-white/50"
                    : colors.number
                }`}
              >
                {menu.number}
              </span>
            )}

            {/* ICON */}
            <span
              className={`relative flex shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                collapsed
                  ? "h-12 w-12"
                  : "h-10 w-10"
              } ${
                active
                  ? colors.activeIcon
                  : colors.icon
              }`}
            >
              <Icon
                size={19}
                strokeWidth={active ? 2.6 : 2.3}
              />
            </span>

            {/* TEXT */}
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-black">
                  {menu.title}
                </span>

                <span
                  className={`mt-0.5 block truncate text-[9px] font-medium ${
                    active
                      ? "text-white/70"
                      : "text-[#a18f87]"
                  }`}
                >
                  {menu.subtitle}
                </span>
              </span>
            )}

            {/* ACTIVE DOT */}
            {!collapsed && active && (
              <span
                className={`h-2 w-2 shrink-0 rounded-full shadow-sm ${
                  menu.color === "ai"
                    ? "bg-[#ffb703]"
                    : "bg-white"
                }`}
              />
            )}

            {/* HOVER LINE */}
            {!collapsed && !active && (
              <span
                className={`absolute bottom-0 left-4 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-[calc(100%-32px)] ${colors.line}`}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}