"use client";

import { ReactNode } from "react";
import Sidebar from "@/app/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#FFF8F3]">

      {/* Sidebar tetap */}

      <Sidebar />

      {/* Area konten */}

      <div className="flex min-w-0 flex-1 flex-col">

        <main className="flex-1 overflow-y-auto p-8">

          {children}

        </main>

      </div>

    </div>
  );
}