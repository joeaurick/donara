"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
  console.log("=== LOGIN DIMULAI ===");

  setErrorMessage("");

  if (!loginId.trim()) {
    setErrorMessage("Email atau username wajib diisi.");
    return;
  }

  if (!password.trim()) {
    setErrorMessage("Password wajib diisi.");
    return;
  }

  setLoading(true);

  try {
    let email = loginId.trim();

    // Jika bukan email, cari berdasarkan username
    if (!loginId.includes("@")) {
      const { data: emailResult, error: rpcError } =
        await supabase.rpc(
          "get_email_by_username",
          {
            p_username: loginId.trim(),
          }
        );

      if (rpcError || !emailResult) {
        setErrorMessage("Username tidak ditemukan.");
        return;
      }

      email = emailResult;
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setErrorMessage(
        "Session tidak berhasil dibuat."
      );
      return;
    }

    console.log("LOGIN BERHASIL");

    router.replace("/admin");
    router.refresh();
  } catch (err) {
    console.error(err);
    setErrorMessage(
      "Terjadi kesalahan saat login."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#fff5f7] via-[#fffdfc] to-[#fff8f5] px-4 py-10 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white/90 shadow-2xl shadow-pink-100/40 backdrop-blur-xl">
          {/* Top accent */}
          <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400" />

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/30">
                <Sparkles className="h-8 w-8" />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
                Donara CMS
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Login Admin
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Masuk ke dashboard untuk mengelola produk, gallery, dan review pelanggan Donara.
              </p>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
  Email atau Username
</label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
  type="text"
  autoComplete="username"
  placeholder="Masukan Email atau Username"
  className="h-14 w-full rounded-2xl border border-pink-100 bg-pink-50/40 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 transition-all duration-300 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
  value={loginId}
  onChange={(e) => setLoginId(e.target.value)}
/>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    className="h-14 w-full rounded-2xl border border-pink-100 bg-pink-50/40 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 transition-all duration-300 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        login();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-pink-600"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={login}
                disabled={loading}
                className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500 text-base font-semibold text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:via-rose-600 hover:to-orange-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses...
                  </span>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 border-t border-pink-100 pt-5 text-center">
              <p className="text-xs leading-5 text-slate-500">
                Donara CMS • Sistem manajemen konten untuk mengelola produk, gallery, dan review pelanggan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}