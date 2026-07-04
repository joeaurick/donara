"use client";

import { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import CreateUserModal from "./components/CreateUserModal";

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  created_at: string;
  last_sign_in_at: string | null;
};

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);

  async function loadUsers() {
    try {
      setLoading(true);

      const res = await fetch("/api/pos/users");

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setUsers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-black">
              Manajemen User POS
            </h1>

            <p className="mt-1 text-gray-500">
              Kelola akun Admin dan Kasir
            </p>

          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-pink-600 px-6 py-3 font-bold text-white hover:bg-pink-700"
          >
            + Tambah User
          </button>

        </div>

        <div className="rounded-2xl bg-white shadow">

          <UserTable
            users={users}
            loading={loading}
            reload={loadUsers}
          />

        </div>

      </div>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          setCreateOpen(false);
          loadUsers();
        }}
      />

    </main>
  );
}