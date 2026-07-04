"use client";

import { useState } from "react";
import EditUserModal from "./EditUserModal";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  created_at: string;
  last_sign_in_at: string | null;
};

type Props = {
  users: User[];
  loading: boolean;
  reload: () => void;
};

export default function UserTable({
  users,
  loading,
  reload,
}: Props) {
  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  async function deleteUser(id: string) {
    if (!confirm("Hapus user ini?")) return;

    const res = await fetch(
      `/api/pos/users/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("User berhasil dihapus");

    reload();
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        Memuat data...
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="px-5 py-4 text-left">
                Nama
              </th>

              <th className="px-5 py-4 text-left">
                Email
              </th>

              <th className="px-5 py-4 text-left">
                Role
              </th>

              <th className="px-5 py-4 text-left">
                Status
              </th>

              <th className="px-5 py-4 text-left">
                Login Terakhir
              </th>

              <th className="px-5 py-4 text-center">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="px-5 py-4">
                  {user.name || "-"}
                </td>

                <td className="px-5 py-4">
                  {user.email}
                </td>

                <td className="px-5 py-4">

                  <span className="rounded bg-blue-100 px-3 py-1 text-sm">

                    {user.role}

                  </span>

                </td>

                <td className="px-5 py-4">

                  {user.active ? (

                    <span className="rounded bg-green-100 px-3 py-1 text-green-700">

                      Aktif

                    </span>

                  ) : (

                    <span className="rounded bg-red-100 px-3 py-1 text-red-700">

                      Nonaktif

                    </span>

                  )}

                </td>

                <td className="px-5 py-4">

                  {user.last_sign_in_at
                    ? new Date(
                        user.last_sign_in_at
                      ).toLocaleString()
                    : "-"}

                </td>

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() =>
                        setSelectedUser(user)
                      }
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteUser(user.id)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Hapus
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() =>
            setSelectedUser(null)
          }
          onSuccess={() => {
            setSelectedUser(null);
            reload();
          }}
        />
      )}

    </>
  );
}