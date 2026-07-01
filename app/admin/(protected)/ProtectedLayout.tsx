"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    try {
      // Cek apakah sudah login
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      // Ambil role dari tabel profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error(error);

        await supabase.auth.signOut();

        router.replace("/admin/login");
        return;
      }

      // Bukan admin
      if (profile.role !== "admin") {
        await supabase.auth.signOut();

        router.replace("/admin/login");
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error(err);

      await supabase.auth.signOut();

      router.replace("/admin/login");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF8F3]">
        <div className="text-center">
          <div className="text-4xl font-black text-pink-600">
            DONARA
          </div>

          <p className="mt-4 text-gray-500">
            Memverifikasi akses...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}