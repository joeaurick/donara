"use client";

import { useRouter } from "next/navigation";
import {
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type Props = {
  onNavigate?: () => void;
};

export default function SidebarFooter({
  onNavigate,
}: Props) {
  const router = useRouter();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    onNavigate?.();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {/* LOGOUT */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b241b] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#2c1913] active:scale-[0.98]"
      >
        <LogOut className="h-4 w-4" />

        Logout
      </button>

      {/* FOOTER INFO */}
      <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/40 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-pink-500 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[10px] font-black text-slate-700">
              DONARA CMS
            </p>

            <p className="text-[8px] text-slate-400">
              © 2026
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-600 ring-1 ring-emerald-100">
          Secure
        </span>
      </div>
    </div>
  );
}