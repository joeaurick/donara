"use client";

import Image from "next/image";
import { X } from "lucide-react";

type Props = {
  collapsed: boolean;
  onClose?: () => void;
};

export default function SidebarHeader({
  collapsed,
  onClose,
}: Props) {
  return (
    <div
      className={`relative z-10 flex shrink-0 items-center ${
        collapsed
          ? "justify-center px-3 py-5"
          : "gap-3 px-5 py-5"
      }`}
    >
      {/* LOGO */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black shadow-[0_10px_25px_rgba(0,0,0,0.28)]">
        <Image
          src="/images/logo/logo-new.png"
          alt="DONARA Logo"
          width={44}
          height={44}
          priority
          className="h-full w-full object-contain"
        />

        {/* STATUS DOT */}
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#2d1b16] bg-[#ffb703]" />
      </div>

      {/* BRAND */}
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[18px] font-black tracking-tight text-white">
            DONARA
          </h1>

          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#46e6b4]" />

            <span className="truncate text-[9px] font-bold uppercase tracking-[0.13em] text-white/45">
              CMS Admin Online
            </span>
          </div>
        </div>
      )}

      {/* CLOSE BUTTON - MOBILE */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95 md:hidden"
          aria-label="Tutup menu"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}