"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Rocket,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

type Props = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export default function SidebarFooter({
  collapsed,
  onNavigate,
}: Props) {
  const router = useRouter();

  async function handleLogout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    onNavigate?.();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div>

      {/* LOGOUT */}
      <button
        type="button"
        onClick={handleLogout}
        title={
          collapsed
            ? "Logout"
            : undefined
        }
        className={`flex w-full items-center rounded-[16px] bg-[#2d1b16] text-white transition hover:bg-[#452820] active:scale-[0.98] ${
          collapsed
            ? "justify-center p-2.5"
            : "justify-center gap-2 px-3 py-3"
        }`}
      >
        <LogOut
          size={17}
          strokeWidth={2.5}
        />

        {!collapsed && (
          <span className="text-[11px] font-black">
            Logout
          </span>
        )}
      </button>
    </div>
  );
}