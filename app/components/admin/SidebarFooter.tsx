"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Globe, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  onNavigate?: () => void;
};

export default function SidebarFooter({ onNavigate }: Props) {
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
      {/* WEBSITE */}
      

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>

      {/* FOOTER INFO */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-slate-400" />

          <div className="leading-tight">
            <p className="font-semibold text-slate-600">
              Donara CMS
            </p>

            <p>© 2026</p>
          </div>
        </div>

        <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600 ring-1 ring-green-100">
          Secure
        </span>
      </div>
    </div>
  );
}