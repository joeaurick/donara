"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase/client";

export default function PosLoginPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
  if (!loginId.trim() || !password.trim()) {
    alert("Email/Username dan password wajib diisi.");
    return;
  }

  setLoading(true);

  try {
    let email = loginId.trim();

    // Jika input bukan email, cari berdasarkan username
if (!loginId.includes("@")) {
  const { data: emailResult, error: rpcError } =
    await supabase.rpc(
      "get_email_by_username",
      {
        p_username: loginId.trim(),
      }
    );

  if (rpcError || !emailResult) {
    alert("Username tidak ditemukan.");
    setLoading(false);
    return;
  }

  email = emailResult;
}

    // Login menggunakan email asli
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/pos/dashboard");
    router.refresh();
  } catch (err) {
    console.error(err);
    setLoading(false);
    alert("Terjadi kesalahan saat login.");
  }
}

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100 px-4 py-10">
      {/* Background Decoration */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-pink-600 text-3xl font-black text-white shadow-lg shadow-pink-500/30">
            D
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            DONARA POS
          </h1>

          <p className="mt-2 text-sm font-medium text-gray-500">
            Login Kasir & Point of Sale
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Email
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </span>

              <input
  type="text"
  placeholder="Email atau Username"
  value={loginId}
  onChange={(e) => setLoginId(e.target.value)}
/>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Password
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>

              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
              />
            </div>
          </div>

          {/* Button Login */}
          <button
            onClick={login}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 py-3.5 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition-all duration-200 hover:from-pink-600 hover:to-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <span>🚀</span>
                Masuk POS
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center text-xs font-medium text-gray-400">
              <span className="bg-white px-3">atau</span>
            </div>
          </div>

          {/* Back to Website */}
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
          >
            <span>🌐</span>
            Kembali ke Website
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[11px] font-medium text-gray-400">
            Donara POS • Secure Cashier Access
          </p>
        </div>
      </div>
    </div>
  );
}