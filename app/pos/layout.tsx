"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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

  // Login tidak memakai sidebar/layout POS
  if (pathname === "/pos/login") {
    return children;
  }

  return (
    <CartProvider>
      <MobileCartProvider>

        <div className="flex min-h-screen bg-gray-100">

          <div className="hidden lg:block">
            <PosSidebar />
          </div>

          <main className="flex-1 overflow-auto pb-20 lg:pb-0">
            {children}
          </main>

          <MobileBottomNav />

        </div>

      </MobileCartProvider>
    </CartProvider>
  );
}