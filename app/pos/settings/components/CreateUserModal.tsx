"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateUserModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function save() {
    if (!email || !password) {
      alert("Email dan Password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/pos/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("User berhasil dibuat");

      setName("");
      setEmail("");
      setPassword("");

      onSuccess();

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white p-6">

        <h2 className="mb-6 text-2xl font-black">
          Tambah User
        </h2>

        <div className="space-y-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama"
            className="w-full rounded-xl border p-3"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border p-3"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2"
          >
            Batal
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="rounded-xl bg-pink-600 px-5 py-2 font-bold text-white"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>

        </div>

      </div>

    </div>
  );
}