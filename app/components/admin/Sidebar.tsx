"use client";

import { useEffect, useState } from "react";

import SidebarHeader from "./SidebarHeader";
import SidebarClock from "./SidebarClock";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
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

    if (dragging) {
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    } else {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [dragging]);

  return (
    <aside
      style={{ width }}
      className="relative flex h-screen shrink-0 flex-col border-r border-pink-100 bg-white shadow-xl"
    >
      <SidebarHeader />

      <SidebarClock />

      <div className="flex-1 overflow-y-auto p-6">
        <SidebarMenu />
      </div>

      <SidebarFooter />

      <div
        onMouseDown={() => setDragging(true)}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-pink-400"
      />
    </aside>
  );
}