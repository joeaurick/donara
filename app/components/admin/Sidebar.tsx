"use client";

import { useEffect, useState } from "react";

import SidebarHeader from "./SidebarHeader";
import SidebarClock from "./SidebarClock";
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
  const [width, setWidth] = useState(288);
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

      if (newWidth < 250) newWidth = 250;
      if (newWidth > 420) newWidth = 420;

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
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        style={{
          width,
        }}
        className={`
fixed left-0 top-0 z-50 h-screen bg-white shadow-xl border-r border-pink-100
transition-transform duration-300
${open ? "translate-x-0" : "-translate-x-full"}
md:translate-x-0 md:static md:flex md:shrink-0
`}
      >
        <div className="flex h-full flex-col">

          <div className="flex items-center justify-between md:block">

            <SidebarHeader />

            <button
              onClick={() => setOpen(false)}
              className="mr-4 rounded-lg p-2 text-2xl md:hidden"
            >
              ✕
            </button>

          </div>

          <SidebarClock />

          <div className="flex-1 overflow-y-auto p-6">
            <SidebarMenu />
          </div>

          <SidebarFooter />

          <div
            onMouseDown={() => setDragging(true)}
            className="absolute right-0 top-0 hidden h-full w-1 cursor-col-resize hover:bg-pink-400 md:block"
          />

        </div>
      </aside>
    </>
  );
}