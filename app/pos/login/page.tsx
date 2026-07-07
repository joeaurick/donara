"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function PosLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function login() {
  setLoading(true);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setLoading(false);
    alert(error.message);
    return;
  }

  router.replace("/pos/dashboard");
  router.refresh();
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="mb-2 text-center text-3xl font-black text-pink-600">
          DONARA POS
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Login Kasir
        </p>

        <div className="space-y-5">

          <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:border-pink-500"
/>

          <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:border-pink-500"
/>

          <button
            onClick={login}
            disabled={loading}
            className="w-full rounded-2xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Masuk POS"}
          </button>

        </div>

      </div>

    </main>
  );
}