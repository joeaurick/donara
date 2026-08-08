"use client";

import { usePathname } from "next/navigation";
import {
  useState,
  type ReactNode,
  useEffect,
} from "react";
import Link from "next/link";

import PosSidebar from "./components/PosSidebar";
import MobileBottomNav from "./components/MobileBottomNav";

import { CartProvider } from "./context/CartContext";
import { MobileCartProvider } from "./context/MobileCartContext";

import { isTodayClosed } from "@/lib/supabase/daily-stock";

export default function PosLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [storeClosed, setStoreClosed] =
    useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const closed = await isTodayClosed();
        setStoreClosed(closed);
      } catch (err) {
        console.error(err);
      }
    }

    loadStatus();
  }, []);

  if (pathname === "/pos/login") {
    return <>{children}</>;
  }

  const menuItems = [
    {
      name: "Dashboard / Kasir",
      href: "/pos",
      icon: "🏠",
    },
    {
      name: "Riwayat Transaksi",
      href: "/pos/history",
      icon: "📜",
    },
    {
      name: "Laporan",
      href: "/pos/report",
      icon: "📊",
    },
    {
      name: "Pengaturan",
      href: "/pos/settings",
      icon: "⚙️",
    },
  ];

  return (
    <CartProvider>
      <MobileCartProvider>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block">
            <PosSidebar />
          </div>

          {/* Main Content */}
          <main className="relative flex-1 overflow-auto pb-20 lg:pb-0">
            {/* Header Mobile */}
            <div className="sticky top-0 z-[40] flex items-center justify-between border-b bg-white px-4 py-3 shadow-xs lg:hidden">
              <span className="text-md font-black tracking-tight text-pink-600">
                DONARA POS {storeClosed ? "(Tutup)" : ""}
              </span>

              <button
                type="button"
                onClick={() =>
                  setIsMenuOpen(!isMenuOpen)
                }
                className="rounded-xl p-2 text-xl font-bold text-gray-600 transition-colors hover:bg-gray-100 active:scale-95"
              >
                {isMenuOpen ? "✕" : "☰"}
              </button>
            </div>

            {/* Drawer Mobile */}
            <div
              className={`
                fixed top-[53px] right-0 bottom-0 z-[50]
                w-64 border-l bg-white p-4 shadow-xl
                transition-transform duration-300 ease-in-out lg:hidden
                ${
                  isMenuOpen
                    ? "translate-x-0"
                    : "translate-x-full"
                }
              `}
            >
              <div className="flex flex-col gap-1.5">
                <span className="mb-2 px-2 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Menu Navigasi
                </span>

                {menuItems.map((item) => {
                  const isActive =
                    pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                        isActive
                          ? "border border-pink-100 bg-pink-50 text-pink-600"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm">
                        {item.icon}
                      </span>

                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Overlay Mobile */}
            {isMenuOpen && (
              <div
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-[45] mt-[53px] bg-black/20 lg:hidden"
              />
            )}

            {/* Page Content */}
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>

          {/* Bottom Navigation Mobile */}
          <MobileBottomNav />
        </div>
      </MobileCartProvider>
    </CartProvider>
  );
}