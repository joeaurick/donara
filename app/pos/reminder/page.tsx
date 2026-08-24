"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  Check,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  createPosReminder,
  deactivatePosReminder,
  deletePosReminder,
  getActivePosReminders,
  updatePosReminder,
  type PosReminder,
} from "@/lib/supabase/pos-reminders";

export default function PosReminderPage() {
  const [reminders, setReminders] = useState<
    PosReminder[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  // =========================
  // LOAD REMINDERS
  // =========================
  async function loadReminders() {
    try {
      setLoading(true);

      const data =
        await getActivePosReminders();

      setReminders(data ?? []);
    } catch (error) {
      console.error(
        "Gagal memuat reminder:",
        error
      );

      alert("Gagal memuat reminder.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReminders();
  }, []);

  // =========================
  // CREATE REMINDER
  // =========================
  async function handleSubmit(
  e: React.FormEvent
) {
  e.preventDefault();

  const cleanMessage =
    message.trim();

  if (!cleanMessage) {
    alert(
      "Isi reminder tidak boleh kosong."
    );

    return;
  }

  setSaving(true);

  try {
    // =========================
    // UPDATE
    // =========================
    if (editingId) {
      const updated =
        await updatePosReminder(
          editingId,
          cleanMessage
        );

      setReminders((prev) =>
        prev.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );

      setEditingId(null);
      setMessage("");

      return;
    }

    // =========================
    // CREATE
    // =========================
    const created =
      await createPosReminder(
        cleanMessage
      );

    setReminders((prev) => [
      created,
      ...prev,
    ]);

    setMessage("");
  } catch (error: any) {
    alert(
      error?.message ||
        "Gagal menyimpan reminder."
    );
  } finally {
    setSaving(false);
  }
}

  // =========================
  // START EDIT
  // =========================
  function handleEdit(
    reminder: PosReminder
  ) {
    setEditingId(reminder.id);
    setMessage(reminder.message);
  }

  // =========================
  // CANCEL EDIT
  // =========================
  function cancelEdit() {
    setEditingId(null);
    setMessage("");
  }

  // =========================
  // COMPLETE REMINDER
  // =========================
  async function handleComplete(
    id: string
  ) {
    if (
      !confirm(
        "Tandai reminder ini sebagai selesai?"
      )
    ) {
      return;
    }

    try {
      await deactivatePosReminder(id);

      setReminders((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (error: any) {
      alert(
        error?.message ||
          "Gagal menyelesaikan reminder."
      );
    }
  }

  // =========================
  // DELETE REMINDER
  // =========================
  async function handleDelete(
    id: string
  ) {
    if (
      !confirm(
        "Hapus reminder ini secara permanen?"
      )
    ) {
      return;
    }

    try {
      await deletePosReminder(id);

      setReminders((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (error: any) {
      alert(
        error?.message ||
          "Gagal menghapus reminder."
      );
    }
  }

  return (
    <main className="min-h-dvh bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <BellRing size={23} />
            </div>

            <div>
              <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
                Reminder POS
              </h1>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Catat kebutuhan dan informasi
                penting untuk operasional toko.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-sm font-black text-gray-800">
              {editingId
                ? "Ubah Reminder"
                : "Tambah Reminder"}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Reminder aktif akan tampil berjalan
              di halaman kasir.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Contoh: Meses coklat sudah habis"
              className="h-12 min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-100"
            />

            <div className="flex gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="h-12 rounded-xl bg-gray-100 px-4 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
                >
                  Batal
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 text-xs font-black text-white transition hover:bg-pink-700 disabled:opacity-60 sm:flex-none"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Plus size={16} />

                    {editingId
                      ? "Simpan"
                      : "Tambah"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* REMINDER LIST */}
        <div className="mt-6">

          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-800">
                Reminder Aktif
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {reminders.length} reminder aktif
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border border-gray-200 bg-white py-16">
              <Loader2
                size={24}
                className="animate-spin text-pink-500"
              />
            </div>
          ) : reminders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-400">
                <BellRing size={24} />
              </div>

              <p className="mt-4 text-sm font-black text-gray-700">
                Belum ada reminder
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Tambahkan catatan penting untuk
                operasional toko.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map(
                (reminder) => (
                  <div
                    key={reminder.id}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                        <BellRing size={16} />
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-sm font-bold text-gray-800">
                          {reminder.message}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          Aktif • tampil di POS
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(reminder)
                        }
                        className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                      >
                        <Pencil size={14} />

                        <span className="sm:hidden">
                          Ubah
                        </span>
                      </button>

                      {/* COMPLETE */}
                      <button
                        type="button"
                        onClick={() =>
                          handleComplete(
                            reminder.id
                          )
                        }
                        className="flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 text-xs font-black text-white transition hover:bg-emerald-600"
                      >
                        <Check size={15} />

                        <span className="sm:hidden">
                          Selesai
                        </span>
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            reminder.id
                          )
                        }
                        className="flex h-10 items-center justify-center rounded-xl bg-red-50 px-3 text-red-500 transition hover:bg-red-100"
                        title="Hapus reminder"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}