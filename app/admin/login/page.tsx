"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function login() {
    console.log("=== LOGIN DIMULAI ===");

    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Email wajib diisi.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log("LOGIN DATA:", data);
      console.log("LOGIN ERROR:", error);

      if (error) {
        console.error(error);
        setErrorMessage(error.message);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SESSION:", session);

      if (!session) {
        setErrorMessage("Session tidak berhasil dibuat.");
        return;
      }

      console.log("LOGIN BERHASIL");

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      console.error("LOGIN EXCEPTION:", err);
      setErrorMessage("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8F3] p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="mb-8 text-center text-4xl font-black text-pink-600">
          Login Admin
        </h1>

        {errorMessage && (
          <div className="mb-5 rounded-xl bg-red-100 p-4 text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="space-y-5">

          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            className="w-full rounded-xl border p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="w-full rounded-xl border p-4"
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
            onClick={login}
            disabled={loading}
            className="w-full rounded-full bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Login"}
          </button>

        </div>
      </div>
    </main>
  );
}