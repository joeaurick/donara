"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  User,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";

export default function PosLoginPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  async function login() {
    if (
      !loginId.trim() ||
      !password.trim()
    ) {
      alert(
        "Email/Username dan password wajib diisi."
      );
      return;
    }

    setLoading(true);

    try {
      let email = loginId.trim();

      // Jika input bukan email, cari berdasarkan username
      if (!loginId.includes("@")) {
        const {
          data: emailResult,
          error: rpcError,
        } = await supabase.rpc(
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

      alert(
        "Terjadi kesalahan saat login."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#171717]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">

        {/* =========================
            LEFT SIDE / BRAND
        ========================= */}
        <section className="relative hidden overflow-hidden bg-[#2d1b16] lg:flex">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(255,255,255,0.8) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.8) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "48px 48px",
            }}
          />

          {/* Decoration */}
          <div className="absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/[0.08]" />

          <div className="absolute -left-20 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full border border-white/[0.08]" />

          <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-[#ffb703]/20" />

          <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-10 xl:p-14">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06]">
                <Image
                  src="/images/logo/logo-new.png"
                  alt="Donara"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-semibold tracking-tight text-white">
                  DONARA
                </p>

                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Point of Sale
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-lg">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-px w-10 bg-[#ffb703]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffb703]">
                  Cashier System
                </span>
              </div>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-white xl:text-5xl">
                Semua transaksi,
                <br />
                lebih sederhana.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-white/50">
                Akses sistem kasir Donara untuk
                mengelola pesanan, pembayaran,
                dan operasional toko.
              </p>

              {/* POS Status */}
              <div className="mt-10 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#46cfa4] opacity-50" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#46cfa4]" />
                </span>

                <span className="text-xs font-medium text-white/50">
                  Sistem POS siap digunakan
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-white/30">
              <span>
                Donara Point of Sale
              </span>

              <span>
                © {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </section>

        {/* =========================
            RIGHT SIDE / LOGIN
        ========================= */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[380px]">

            {/* =========================
                MOBILE BRAND
            ========================= */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2d1b16]">
                <Image
                  src="/images/logo/logo-new.png"
                  alt="Donara"
                  width={27}
                  height={27}
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-semibold tracking-tight text-[#2d1b16]">
                  DONARA
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#a18f87]">
                  Point of Sale
                </p>
              </div>
            </div>

            {/* =========================
                LOGIN HEADER
            ========================= */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d93668]">
                Akses Kasir
              </p>

              <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.04em] text-[#2d1b16]">
                Masuk ke POS
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8c7a72]">
                Masukkan akun Anda untuk
                melanjutkan ke sistem kasir.
              </p>
            </div>

            {/* =========================
                FORM
            ========================= */}
            <div className="mt-8 space-y-5">

              {/* LOGIN ID */}
              <div>
                <label
                  htmlFor="loginId"
                  className="mb-2 block text-sm font-medium text-[#2d1b16]"
                >
                  Email atau username
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a18f87]" />

                  <input
                    id="loginId"
                    type="text"
                    autoComplete="username"
                    placeholder="Email atau username"
                    value={loginId}
                    disabled={loading}
                    onChange={(e) =>
                      setLoginId(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        login();
                      }
                    }}
                    className="h-11 w-full rounded-lg border border-[#e8ddd7] bg-white pl-10 pr-4 text-sm text-[#2d1b16] outline-none transition placeholder:text-[#b9a79f] hover:border-[#d8c8c0] focus:border-[#2d1b16] focus:ring-1 focus:ring-[#2d1b16] disabled:cursor-not-allowed disabled:bg-[#f7f3f1]"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#2d1b16]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a18f87]" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    value={password}
                    disabled={loading}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        login();
                      }
                    }}
                    className="h-11 w-full rounded-lg border border-[#e8ddd7] bg-white pl-10 pr-11 text-sm text-[#2d1b16] outline-none transition placeholder:text-[#b9a79f] hover:border-[#d8c8c0] focus:border-[#2d1b16] focus:ring-1 focus:ring-[#2d1b16] disabled:cursor-not-allowed disabled:bg-[#f7f3f1]"
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#a18f87] transition hover:bg-[#fff8f7] hover:text-[#2d1b16]"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="button"
                onClick={login}
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2d1b16] px-4 text-sm font-semibold text-white transition hover:bg-[#432821] focus:outline-none focus:ring-2 focus:ring-[#2d1b16] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke POS

                    <ArrowRight
                      size={16}
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </button>
            </div>

            {/* =========================
                DIVIDER
            ========================= */}
            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#eee7e3]" />

              <span className="text-[10px] font-medium text-[#b9a79f]">
                atau
              </span>

              <div className="h-px flex-1 bg-[#eee7e3]" />
            </div>

            {/* =========================
                BACK TO WEBSITE
            ========================= */}
            <Link
              href="/"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#e8ddd7] bg-white text-sm font-medium text-[#6f5e57] transition hover:border-[#d8c8c0] hover:bg-[#fffaf5] hover:text-[#2d1b16]"
            >
              Kembali ke Website

              <ArrowRight
                size={15}
                strokeWidth={2}
              />
            </Link>

            {/* =========================
                FOOTER
            ========================= */}
            <p className="mt-8 text-center text-[11px] leading-5 text-[#b9a79f]">
              Area ini khusus untuk pengguna
              sistem kasir Donara.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}