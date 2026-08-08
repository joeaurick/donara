"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SidebarClock from "./SidebarClock";
import SidebarFooter from "./SidebarFooter";

const menus = [
  {
    title: "Mulai Penjualan",
    href: "/pos/dashboard",
    icon: "🚀",
  },
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: "🏠",
  },
  {
    title: "Produk",
    href: "/admin/products",
    icon: "📦",
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: "🖼️",
  },
  {
    title: "Review",
    href: "/admin/reviews",
    icon: "💬",
  },
  {
    title: "SEO",
    href: "/admin/seo",
    icon: "🌐",
  },
  {
    title: "Business",
    href: "/admin/business",
    icon: "🏢",
  },
  {
    title: "Homepage",
    href: "/admin/homepage",
    icon: "🏡",
  },
];

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ open, setOpen }: Props) {
  const pathname = usePathname();

  const [width, setWidth] = useState(272);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-width");

    if (saved) {
      const value = Number(saved);

      if (!Number.isNaN(value)) {
        setWidth(value);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-width", width.toString());
  }, [width]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!dragging) return;

      let newWidth = e.clientX;

      if (newWidth < 248) newWidth = 248;
      if (newWidth > 340) newWidth = 340;

      setWidth(newWidth);
    }

    function handleMouseUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <>
      {/* OVERLAY MOBILE */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/35 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        style={{ width }}
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-pink-100 bg-white transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:sticky md:top-0 md:z-20 md:translate-x-0`}
      >
        {/* HEADER MOBILE */}
        <div className="flex items-center justify-between border-b border-pink-100 px-5 py-4 md:hidden">
          <div>
            <h1 className="text-xl font-black text-pink-600">DONARA</h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
              CMS Admin
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-pink-100 bg-white text-gray-500 transition hover:bg-pink-50 hover:text-pink-600"
            aria-label="Tutup menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* HEADER DESKTOP */}
        <div className="hidden border-b border-pink-100 px-5 py-5 md:block">
          <SidebarHeader />
        </div>

        {/* JAM */}
        <div className="border-b border-pink-100 px-4 py-4">
          <SidebarClock />
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-2">
            {menus.map((menu) => {
              const active = pathname.startsWith(menu.href);

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => {
                    // AUTO CLOSE SAAT MENU DIKLIK
                    setOpen(false);
                  }}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/25"
                      : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <span className="text-lg">{menu.icon}</span>

                  <span className="flex-1 truncate">{menu.title}</span>

                  {active && (
                    <span className="h-2 w-2 rounded-full bg-white/90" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="border-t border-pink-100 bg-white px-4 py-4">
          <SidebarFooter />
        </div>

        {/* RESIZE HANDLE DESKTOP */}
        <div
          onMouseDown={() => setDragging(true)}
          className="absolute right-0 top-0 hidden h-full w-1.5 cursor-col-resize hover:bg-pink-200 md:block"
        />
      </aside>
    </>
  );
}