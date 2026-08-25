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
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#2d1b16] shadow-[0_10px_25px_rgba(45,27,22,0.18)]">
        <Image
          src="/images/logo/logo-new.png"
          alt="DONARA Logo"
          width={48}
          height={48}
          priority
          className="h-full w-full object-contain"
        />

        {/* STATUS DOT */}
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
      </div>

      {/* BRAND */}
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <h1 className="text-[18px] font-black tracking-tight text-[#2d1b16]">
            DONARA
          </h1>

          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

            <span className="truncate text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
              CMS Admin Online
            </span>
          </div>
        </div>
      )}

      {/* CLOSE MOBILE */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white text-slate-500 shadow-sm transition hover:bg-pink-50 hover:text-pink-600 active:scale-95 md:hidden"
          aria-label="Tutup menu"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}