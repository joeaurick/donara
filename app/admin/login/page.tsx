"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
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

      // Jika login menggunakan username
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
          setErrorMessage(
            "Username tidak ditemukan."
          );
          return;
        }

        email = emailResult;
      }

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

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

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen bg-[#fafafa] text-[#171717]">
      {/* =========================
          LEFT BRAND AREA
      ========================= */}
      <section className="relative hidden w-[46%] overflow-hidden border-r border-[#eaeaea] bg-[#171717] lg:flex">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
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
            backgroundSize: "42px 42px",
          }}
        />

        {/* Decoration */}
        <div className="absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full border border-white/[0.08]" />

        <div className="absolute -left-24 top-[28%] h-[300px] w-[300px] rounded-full border border-white/[0.07]" />

        <div className="absolute bottom-[-140px] right-[-120px] h-[420px] w-[420px] rounded-full border border-white/[0.08]" />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06]">
              <Image
                src="/images/logo/logo-new.png"
                alt="Donara"
                width={26}
                height={26}
                className="h-6 w-6 object-contain"
              />
            </div>

            <span className="text-sm font-semibold tracking-tight text-white">
              DONARA
            </span>
          </div>

          {/* Center */}
          <div className="max-w-md">
            <div className="mb-6 h-px w-10 bg-white/30" />

            <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-white xl:text-5xl">
              Kelola bisnis Anda
              <br />
              dengan lebih mudah.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
              Satu dashboard untuk mengelola
              operasional, produk, dan aktivitas
              bisnis Donara.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-white/35">
            <span>Donara CMS</span>

            <span>
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          LOGIN AREA
      ========================= */}
      <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[380px]">
          {/* =========================
              MOBILE LOGO
          ========================= */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#171717]">
              <Image
                src="/images/logo/logo-new.png"
                alt="Donara"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </div>

            <span className="text-sm font-semibold tracking-tight text-[#171717]">
              DONARA
            </span>
          </div>

          {/* =========================
              HEADER
          ========================= */}
          <div>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-[#171717]">
              Masuk ke akun Anda
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#737373]">
              Masukkan informasi akun untuk
              melanjutkan ke dashboard.
            </p>
          </div>

          {/* =========================
              ERROR
          ========================= */}
          {errorMessage && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3">
              <p className="text-sm text-red-600">
                {errorMessage}
              </p>
            </div>
          )}

          {/* =========================
              FORM
          ========================= */}
          <div className="mt-8 space-y-5">
            {/* LOGIN ID */}
            <div>
              <label
                htmlFor="loginId"
                className="mb-2 block text-sm font-medium text-[#171717]"
              >
                Email atau username
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a3a3]" />

                <input
                  id="loginId"
                  type="text"
                  autoComplete="username"
                  placeholder="Email atau username"
                  value={loginId}
                  onChange={(e) =>
                    setLoginId(e.target.value)
                  }
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-[#e5e5e5] bg-white pl-10 pr-3 text-sm text-[#171717] outline-none transition placeholder:text-[#a3a3a3] hover:border-[#d4d4d4] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] disabled:cursor-not-allowed disabled:bg-[#fafafa]"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#171717]"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3a3a3]" />

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
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                  disabled={loading}
                  className="h-11 w-full rounded-lg border border-[#e5e5e5] bg-white pl-10 pr-11 text-sm text-[#171717] outline-none transition placeholder:text-[#a3a3a3] hover:border-[#d4d4d4] focus:border-[#171717] focus:ring-1 focus:ring-[#171717] disabled:cursor-not-allowed disabled:bg-[#fafafa]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#737373] transition hover:bg-[#f5f5f5] hover:text-[#171717] disabled:cursor-not-allowed"
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
              className="flex h-11 w-full items-center justify-center rounded-lg bg-[#171717] px-4 text-sm font-medium text-white transition hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#737373]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Memproses...
                </span>
              ) : (
                <>
                  Masuk

                  <span className="ml-2 text-base leading-none">
                    →
                  </span>
                </>
              )}
            </button>
          </div>

          {/* =========================
              SECURITY NOTE
          ========================= */}
          <div className="mt-8 border-t border-[#eaeaea] pt-5">
            <p className="text-center text-xs leading-5 text-[#a3a3a3]">
              Area ini khusus untuk pengguna yang
              memiliki akses ke Donara CMS.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}