"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/app/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FFF8F3]">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header Mobile */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-pink-100 bg-white px-4 shadow md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border border-pink-200 p-2"
          >
            ☰
          </button>

          <h1 className="font-bold text-pink-600">
            DONARA CMS
          </h1>

          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}