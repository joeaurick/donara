"use client";

import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobile?: boolean;
};

export default function Sidebar({
  setOpen,
  mobile = false,
}: Props) {
  const [width, setWidth] = useState(272);
  const [dragging, setDragging] = useState(false);

  /* =========================
      LOAD WIDTH
  ========================== */

  useEffect(() => {
    if (mobile) return;

    const saved = localStorage.getItem("sidebar-width");

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

    localStorage.setItem("sidebar-width", String(width));
  }, [width, mobile]);

  /* =========================
      RESIZE
  ========================== */

  useEffect(() => {
    if (mobile) return;

    function handleMouseMove(e: MouseEvent) {
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
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
      className={`
        relative
        flex
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-orange-100
        bg-[#fdfcfb]
        ${
          mobile
            ? "h-full min-h-0 w-full"
            : "h-dvh min-h-dvh"
        }
      `}
    >
      {/* =========================
          BACKGROUND
      ========================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-pink-100/50 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      {/* =========================
          HEADER
      ========================== */}

      <div className="relative z-10 shrink-0 px-4 pb-3 pt-4">
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
          MENU

          flex-1 + min-h-0 adalah
          bagian penting agar menu
          mengisi ruang kosong.
      ========================== */}

      <nav className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-2">
        <div className="mb-4 flex items-center gap-3 px-1">
          <div className="h-px flex-1 bg-orange-100" />

          <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.24em] text-orange-400">
            Menu Utama
          </span>

          <div className="h-px flex-1 bg-orange-100" />
        </div>

        <SidebarMenu
          collapsed={false}
          onNavigate={handleNavigate}
        />
      </nav>

      {/* =========================
          FOOTER

          mt-auto memastikan footer
          selalu berada paling bawah.
      ========================== */}

      <div className="relative z-10 mt-auto shrink-0 border-t border-orange-100 bg-white/95 px-4 py-4 backdrop-blur-xl">
        <SidebarFooter
          collapsed={false}
          onNavigate={handleNavigate}
        />
      </div>

      {/* =========================
          RESIZE DESKTOP
      ========================== */}

      {!mobile && (
        <div
          onMouseDown={() => setDragging(true)}
          className={`
            group
            absolute
            right-0
            top-0
            z-30
            hidden
            h-full
            w-2
            cursor-col-resize
            xl:block
            ${
              dragging
                ? "bg-pink-100"
                : ""
            }
          `}
        >
          <div
            className={`
              absolute
              right-0
              top-1/2
              h-14
              w-1
              -translate-y-1/2
              rounded-full
              transition
              ${
                dragging
                  ? "bg-pink-400"
                  : "bg-transparent group-hover:bg-pink-200"
              }
            `}
          />

          {dragging && (
            <div className="absolute right-0 top-1/2 translate-x-[3px] -translate-y-1/2 text-pink-500">
              <GripVertical size={13} />
            </div>
          )}
        </div>
      )}
    </aside>
  );
}