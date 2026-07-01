"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
        alert("Gagal logout.");
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat logout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "Keluar..." : "Logout"}
    </button>
  );
}