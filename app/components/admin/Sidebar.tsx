"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SidebarClock from "./SidebarClock";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
import AdminLogout from "@/app/components/AdminLogout";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ open, setOpen }: Props) {
  const [width, setWidth] = useState(248);
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

      if (newWidth < 220) newWidth = 220;
      if (newWidth > 320) newWidth = 320;

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
      {/* Overlay Mobile */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        style={{ width }}
        className={`fixed left-0 top-0 z-50 h-screen overflow-hidden border-r border-pink-100 bg-white shadow-xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        } md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0 md:shadow-none`}
      >
        <div className="flex h-full flex-col">
          {/* Tombol Close Mobile */}
          <div className="flex items-center justify-end border-b border-pink-100 px-3 py-2 md:hidden">
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-pink-100 bg-white text-slate-500 shadow-sm transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
              aria-label="Tutup menu"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Header */}
          <div className="border-b border-pink-100 px-4 py-3">
            <SidebarHeader />
          </div>

          {/* Clock */}
          <div className="border-b border-pink-100 px-4 py-3">
            <SidebarClock />
          </div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <SidebarMenu />
          </div>

          {/* Logout */}
          <div className="border-t border-pink-100 px-3 py-3">
            <div className="scale-90 origin-left">
              <AdminLogout />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-pink-100 bg-white px-3 py-2">
            <SidebarFooter />
          </div>

          {/* Resize Handle Desktop */}
          <div
            onMouseDown={() => setDragging(true)}
            className="absolute right-0 top-0 hidden h-full w-1 cursor-col-resize hover:bg-pink-300 md:block"
          />
        </div>
      </aside>
    </>
  );
}