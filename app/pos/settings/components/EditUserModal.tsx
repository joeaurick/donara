"use client";

import { useState } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
};

type Props = {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUserModal({
  user,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [active, setActive] = useState(user.active);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function save() {
    try {
      setLoading(true);

      const body: any = {
        name,
        role,
        active,
      };

      if (password.trim() !== "") {
        body.password = password;
      }

      const res = await fetch(`/api/pos/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("User berhasil diperbarui");

      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-lg rounded-2xl bg-white p-6">

        <h2 className="mb-6 text-2xl font-black">
          Edit User
        </h2>

        <div className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Email
            </label>

            <input
              value={user.email}
              disabled
              className="w-full rounded-xl border bg-gray-100 p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Nama
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Password Baru
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kosongkan jika tidak diubah"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={active}
              onChange={(e) =>
                setActive(e.target.checked)
              }
            />

            User Aktif

          </label>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3"
          >
            Batal
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="rounded-xl bg-pink-600 px-6 py-3 font-bold text-white"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>

        </div>

      </div>

    </div>
  );
}