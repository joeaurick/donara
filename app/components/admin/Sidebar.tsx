"use client";

import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  mobile?: boolean;
};

export default function Sidebar({
  setOpen,
  mobile = false,
}: Props) {
  const [width, setWidth] = useState(300);
  const [dragging, setDragging] =
    useState(false);

  /* =========================
      LOAD WIDTH
  ========================== */

  useEffect(() => {
    if (mobile) return;

    const saved = localStorage.getItem(
      "sidebar-width"
    );

    if (!saved) return;

    const value = Number(saved);

    if (!Number.isNaN(value)) {
      setWidth(value);
    }
  }, [mobile]);

  /* =========================
      SAVE WIDTH
  ========================== */

  useEffect(() => {
    if (mobile) return;

    localStorage.setItem(
      "sidebar-width",
      String(width)
    );
  }, [width, mobile]);

  /* =========================
      RESIZE DESKTOP
  ========================== */

  useEffect(() => {
    if (mobile) return;

    function handleMouseMove(
      e: MouseEvent
    ) {
      if (!dragging) return;

      let newWidth = e.clientX;

      if (newWidth < 248) {
        newWidth = 248;
      }

      if (newWidth > 340) {
        newWidth = 340;
      }

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
  }, [dragging, mobile]);

  /* =========================
      NAVIGATE
  ========================== */

  function handleNavigate() {
    if (mobile) {
      setOpen(false);
    }
  }

  return (
    <aside
      style={
        mobile
          ? undefined
          : {
              width,
            }
      }
      className={`relative flex shrink-0 flex-col overflow-hidden bg-[#2d1b16] transition-all duration-300 ease-out ${
        mobile
          ? "h-full w-[300px] max-w-[88vw]"
          : "h-screen"
      }`}
    >
      {/* =========================
          BACKGROUND DECORATION
      ========================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border-[24px] border-pink-400/10" />

        <div className="absolute -left-20 top-[40%] h-52 w-52 rounded-full bg-orange-400/5 blur-3xl" />

        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="absolute right-5 top-[180px] h-10 w-2 rotate-[25deg] rounded-full bg-[#ffb703]/20" />

        <div className="absolute left-7 top-[330px] h-8 w-2 rotate-[45deg] rounded-full bg-[#ff6b93]/20" />
      </div>

      {/* =========================
          HEADER
      ========================== */}

      <div className="relative z-10 shrink-0">
        <SidebarHeader
          collapsed={false}
          onClose={
            mobile
              ? () => setOpen(false)
              : undefined
          }
        />
      </div>

      {/* =========================
          RECEIPT CONTAINER
      ========================== */}

      <div className="relative z-10 mx-3 mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[30px] bg-[#fffaf5] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        {/* =========================
            RECEIPT TOP
        ========================== */}

        <div className="relative px-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-[#eaded7]" />

            <span className="shrink-0 text-[8px] font-black uppercase tracking-[0.2em] text-[#aa9288]">
              Donara Admin
            </span>

            <span className="h-px flex-1 bg-[#eaded7]" />
          </div>
        </div>

        {/* =========================
            MENU
        ========================== */}

        <nav className="relative flex-1 overflow-y-auto px-3 py-4">
          <SidebarMenu
  collapsed={false}
  onNavigate={handleNavigate}
/>
        </nav>

        {/* =========================
            FOOTER
        ========================== */}

        <div className="relative shrink-0 border-t border-dashed border-[#eaded7] p-3">
          <SidebarFooter
  collapsed={false}
  onNavigate={handleNavigate}
/>
        </div>
      </div>

      {/* =========================
          BOTTOM BRAND
      ========================== */}

      {!mobile && (
        <div className="relative z-10 flex shrink-0 items-center justify-center gap-2 px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c86]" />

          <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/35">
            Donara CMS
          </span>

          <span className="text-[8px] text-white/20">
            v1.0
          </span>
        </div>
      )}

      {/* =========================
          RESIZE HANDLE DESKTOP
      ========================== */}

      {!mobile && (
        <div
          onMouseDown={() =>
            setDragging(true)
          }
          className={`group absolute right-0 top-0 z-30 hidden h-full w-2 cursor-col-resize xl:block ${
            dragging
              ? "bg-pink-500/10"
              : ""
          }`}
        >
          <div
            className={`absolute right-0 top-1/2 h-14 w-1 -translate-y-1/2 rounded-full transition ${
              dragging
                ? "bg-[#ff5c86]"
                : "bg-transparent group-hover:bg-pink-300"
            }`}
          />

          {dragging && (
            <div className="absolute right-0 top-1/2 translate-x-[3px] -translate-y-1/2 text-[#ff5c86]">
              <GripVertical size={13} />
            </div>
          )}
        </div>
      )}
    </aside>
  );
}