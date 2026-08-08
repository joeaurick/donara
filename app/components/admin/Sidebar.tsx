"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SidebarClock from "./SidebarClock";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ open, setOpen }: Props) {
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
      if (newWidth > 360) newWidth = 360;

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
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
  style={{ width }}
  className={`fixed left-0 top-0 z-50 h-screen overflow-hidden border-r border-pink-100 bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
    open ? "translate-x-0" : "-translate-x-full"
  } md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0 md:shadow-none`}
>
  <div className="flex h-full min-h-0 flex-col">
          {/* Top */}
          <div className="border-b border-pink-100 bg-gradient-to-r from-pink-50/70 to-orange-50/30">
  <div className="flex items-center justify-between px-4 py-2 md:px-4">
    <SidebarHeader />

    <button
      onClick={() => setOpen(false)}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-pink-100 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600 md:hidden"
      aria-label="Tutup menu"
    >
      <X className="h-4 w-4" />
    </button>
  </div>

  <div className="px-4 pb-2 md:px-4">
    <SidebarClock />
  </div>
</div>

          {/* Menu */}
          <div className="flex-1 overflow-y-auto px-3 py-4 md:px-4">
  <div className="flex-1 overflow-y-auto p-6">
  <SidebarMenu
    onNavigate={() => setOpen(false)}
  />
</div>
</div>

          {/* Footer */}
          <div className="border-t border-pink-100 bg-white/70 px-4 py-4 md:px-5">
            <SidebarFooter />
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={() => setDragging(true)}
            className="absolute right-0 top-0 hidden h-full w-1.5 cursor-col-resize rounded-full transition-all duration-200 hover:bg-pink-300 md:block"
          >
            <div className="mx-auto mt-24 h-20 w-0.5 rounded-full bg-pink-100" />
          </div>
        </div>
      </aside>
    </>
  );
}