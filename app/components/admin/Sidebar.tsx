"use client";

import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  open,
  setOpen,
}: Props) {
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

  function handleNavigate() {
    setOpen(false);
  }

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        style={{ width }}
        className={`fixed left-0 top-0 z-50 flex h-dvh flex-col overflow-hidden border-r border-orange-100 bg-[#fdfcfb] transition-transform duration-300 ease-out ${
          open
            ? "translate-x-0 shadow-[18px_0_55px_rgba(15,23,42,0.18)]"
            : "-translate-x-full"
        } md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0 md:shadow-none`}
      >
        {/* DECORATION */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-pink-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-100/40 blur-3xl" />

        {/* HEADER */}
        <div className="relative shrink-0 px-4 pb-3 pt-4">
          <SidebarHeader
            onClose={() => setOpen(false)}
          />
        </div>

        {/* MENU */}
        <nav className="relative flex-1 overflow-y-auto px-4 py-2">
          {/* MENU TITLE */}
          <div className="mb-4 flex items-center gap-3 px-1">
            <div className="h-px flex-1 bg-orange-100" />

            <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.24em] text-orange-400">
              Menu Utama
            </span>

            <div className="h-px flex-1 bg-orange-100" />
          </div>

          <SidebarMenu
            onNavigate={handleNavigate}
          />
        </nav>

        {/* FOOTER */}
        <div className="relative shrink-0 border-t border-orange-100 bg-white/85 px-4 py-4 backdrop-blur-xl">
          <SidebarFooter
            onNavigate={handleNavigate}
          />
        </div>

        {/* RESIZE HANDLE DESKTOP */}
        <div
          onMouseDown={() => setDragging(true)}
          className={`group absolute right-0 top-0 hidden h-full w-2 cursor-col-resize md:block ${
            dragging ? "bg-pink-100" : ""
          }`}
        >
          <div
            className={`absolute right-0 top-1/2 h-14 w-1 -translate-y-1/2 rounded-full transition ${
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