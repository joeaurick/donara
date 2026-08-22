"use client";

import { X } from "lucide-react";

type Props = {
  onClose?: () => void;
};

export default function SidebarHeader({
  onClose,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#281711] via-[#43261b] to-[#2d1a15] px-4 py-4 text-white shadow-[0_12px_30px_rgba(60,30,20,0.22)]">
      {/* DECORATION */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-pink-500/20" />

      <div className="pointer-events-none absolute right-4 top-3 h-16 w-16 rounded-full bg-orange-400/10" />

      <div className="pointer-events-none absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-orange-400/10" />

      {/* HEADER */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* LOGO */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 via-pink-500 to-pink-700 text-xl font-black shadow-lg shadow-pink-950/30">
            ◉

            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-orange-300" />
          </div>

          {/* BRAND */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-black tracking-wide">
                DONARA
              </h1>

              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-pink-100">
                CMS
              </span>
            </div>

            <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Donut Management
            </p>
          </div>
        </div>

        {/* CLOSE MOBILE ONLY */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95 md:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* STATUS */}
      <div className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

        <span className="text-[9px] font-medium text-white/90">
          Admin Panel Aktif
        </span>
      </div>
    </div>
  );
}