"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GripVertical, X } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";

const menus = [
  {
    title: "Mulai Penjualan",
    href: "/pos/dashboard",
    icon: "🚀",
    badge: "POS",
  },
  {
    title: "Dashboard",
    href: "/admin",
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

export default function Sidebar({
  open,
  setOpen,
}: Props) {
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
    localStorage.setItem(
      "sidebar-width",
      width.toString()
    );
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

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );
    };
  }, [dragging]);

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        style={{ width }}
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r border-pink-100/80 bg-[#fffdfb] transition-transform duration-300 ease-out ${
          open
            ? "translate-x-0 shadow-[20px_0_60px_rgba(15,23,42,0.12)]"
            : "-translate-x-full"
        } md:sticky md:top-0 md:z-20 md:translate-x-0 md:shadow-none`}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-orange-100/40 blur-3xl" />

        {/* ================= MOBILE HEADER ================= */}
        <div className="relative flex items-center justify-between border-b border-pink-100 bg-white/80 px-5 py-4 backdrop-blur-xl md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-xl shadow-lg shadow-pink-500/25">
              🍩
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                DONARA
              </h1>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-500">
                CMS Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition hover:border-pink-100 hover:bg-pink-50 hover:text-pink-600 active:scale-95"
            aria-label="Tutup menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ================= DESKTOP HEADER ================= */}
        <div className="relative hidden border-b border-pink-100/80 bg-white/70 px-5 py-5 backdrop-blur-xl md:block">
          <SidebarHeader />
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-5">
          {/* Section label */}
          <div className="mb-3 flex items-center gap-2 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Menu Utama
            </p>
          </div>

          <div className="space-y-1.5">
            {menus.map((menu) => {
              const active =
                menu.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === menu.href ||
                    pathname.startsWith(
                      `${menu.href}/`
                    );

              const isPos = menu.href === "/pos/dashboard";

              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 font-black text-white shadow-lg shadow-pink-500/25"
                      : isPos
                        ? "border border-orange-100 bg-orange-50/70 font-bold text-orange-700 hover:bg-orange-100"
                        : "font-semibold text-slate-600 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <span className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-white/80" />
                  )}

                  {/* Icon */}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base transition-all duration-200 ${
                      active
                        ? "bg-white/20 shadow-sm"
                        : isPos
                          ? "bg-orange-100"
                          : "bg-white shadow-sm ring-1 ring-slate-100 group-hover:bg-pink-100 group-hover:text-pink-600"
                    }`}
                  >
                    {menu.icon}
                  </span>

                  {/* Text */}
                  <span className="min-w-0 flex-1 truncate">
                    {menu.title}
                  </span>

                  {/* Badge */}
                  {"badge" in menu &&
                    menu.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-orange-200/70 text-orange-700"
                        }`}
                      >
                        {menu.badge}
                      </span>
                    )}

                  {/* Active dot */}
                  {active && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white shadow-sm" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ================= FOOTER ================= */}
        <div className="relative border-t border-pink-100/80 bg-white/75 px-4 py-4 backdrop-blur-xl">
          <SidebarFooter />
        </div>

        {/* ================= RESIZE HANDLE ================= */}
        <div
          onMouseDown={() => setDragging(true)}
          className={`group absolute right-0 top-0 hidden h-full w-2 cursor-col-resize md:block ${
            dragging ? "bg-pink-100" : ""
          }`}
        >
          <div
            className={`absolute right-0 top-1/2 flex h-14 w-1 -translate-y-1/2 items-center justify-center rounded-full transition ${
              dragging
                ? "bg-pink-400"
                : "bg-transparent group-hover:bg-pink-200"
            }`}
          />

          {dragging && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[3px] text-pink-500">
              <GripVertical size={13} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}