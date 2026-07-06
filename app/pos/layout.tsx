"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import Link from "next/link";

import PosSidebar from "./components/PosSidebar";
import MobileBottomNav from "./components/MobileBottomNav";

import { CartProvider } from "./context/CartContext";
import { MobileCartProvider } from "./context/MobileCartContext";

export default function PosLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Login tidak memakai sidebar/layout POS
  if (pathname === "/pos/login") {
    return children;
  }

  const menuItems = [
    { name: "Dashboard / Kasir", href: "/pos", icon: "🏠" },
    { name: "Riwayat Transaksi", href: "/pos/history", icon: "📜" },
    { name: "Laporan", href: "/pos/report", icon: "📊" },
    { name: "Pengaturan", href: "/pos/settings", icon: "⚙️" },
  ];

  return (
    <CartProvider>
      <MobileCartProvider>
        <div className="flex min-h-screen bg-gray-100">
          
          {/* SIDEBAR DESKTOP */}
          <div className="hidden lg:block">
            <PosSidebar />
          </div>

          {/* KONTEN UTAMA */}
          <main className="flex-1 overflow-auto pb-20 lg:pb-0 relative">
            
            {/* 📱 TOMBOL HAMBURGER MOBILE (Hanya muncul di layar HP) */}
            <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-[40] shadow-xs">
              <span className="font-black text-pink-600 tracking-tight text-md">DONARA POS</span>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-bold text-xl active:scale-95"
              >
                {isMenuOpen ? "✕" : "☰"}
              </button>
            </div>

            {/* LACI NAVIGASI HAMBURGER MOBILE (Slide out dari kanan) */}
            <div className={`
              fixed top-[53px] right-0 bottom-0 z-[50] w-64 bg-white border-l shadow-xl p-4
              transition-transform duration-300 ease-in-out lg:hidden
              ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
            `}>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-2 mb-2">Menu Navigasi</span>
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        isActive 
                          ? "bg-pink-50 text-pink-600 border border-pink-100" 
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* OVERLAY LATAR HITAM (Klik di luar laci untuk menutup menu) */}
            {isMenuOpen && (
              <div 
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/20 z-[45] lg:hidden mt-[53px]"
              />
            )}

            {/* Isi halaman POS */}
            {children}
          </main>

          {/* NAVIGASI BAWAH MOBILE */}
          <MobileBottomNav />

        </div>
      </MobileCartProvider>
    </CartProvider>
  );
}