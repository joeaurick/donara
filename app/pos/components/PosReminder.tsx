"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  createPosReminder,
  deactivatePosReminder,
  deletePosReminder,
  getActivePosReminders,
  updatePosReminder,
  type PosReminder as PosReminderType,
} from "@/lib/supabase/pos-reminders";

type PosReminderProps = {
  isAdmin?: boolean;
};

export default function PosReminder({
  isAdmin = false,
}: PosReminderProps) {
  const [reminders, setReminders] = useState<
    PosReminderType[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingMessage, setEditingMessage] =
    useState("");

  const [actionLoadingId, setActionLoadingId] =
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
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadReminders();
  }, []);

  // =========================
  // CREATE REMINDER
  // =========================
  async function handleCreate(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      setSaving(true);

      const newReminder =
        await createPosReminder(
          message
        );

      setReminders((prev) => [
        newReminder,
        ...prev,
      ]);

      setMessage("");

      setShowForm(false);
    } catch (error: any) {
      alert(
        error?.message ||
          "Gagal membuat reminder."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // START EDIT
  // =========================
  function handleStartEdit(
    reminder: PosReminderType
  ) {
    setEditingId(reminder.id);

    setEditingMessage(
      reminder.message
    );

    setShowForm(false);
  }

  // =========================
  // CANCEL EDIT
  // =========================
  function handleCancelEdit() {
    setEditingId(null);

    setEditingMessage("");
  }

  // =========================
  // SAVE EDIT
  // =========================
  async function handleSaveEdit(
    id: string
  ) {
    if (!editingMessage.trim()) {
      return;
    }

    try {
      setActionLoadingId(id);

      const updated =
        await updatePosReminder(
          id,
          editingMessage
        );

      setReminders((prev) =>
        prev.map((item) =>
          item.id === id
            ? updated
            : item
        )
      );

      setEditingId(null);

      setEditingMessage("");
    } catch (error: any) {
      alert(
        error?.message ||
          "Gagal mengubah reminder."
      );
    } finally {
      setActionLoadingId(null);
    }
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
      setActionLoadingId(id);

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
    } finally {
      setActionLoadingId(null);
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
        "Hapus reminder ini?"
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(id);

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
    } finally {
      setActionLoadingId(null);
    }
  }

  // =========================
  // EMPTY FOR NON ADMIN
  // =========================
  if (
    !loading &&
    reminders.length === 0 &&
    !isAdmin
  ) {
    return null;
  }

  const reminderText =
    reminders
      .map(
        (item) =>
          `🔔 ${item.message}`
      )
      .join(
        "     •     "
      );

  return (
    <div className="w-full">

      {/* =====================
          MAIN CONTAINER
      ====================== */}
      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

        {/* =====================
            HEADER
        ====================== */}
        <div className="flex min-h-[52px] items-center border-b border-pink-100 bg-gradient-to-r from-pink-50 via-white to-orange-50 px-3 sm:px-4">

          {/* ICON */}
          <div className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-white shadow-sm">
            <BellRing
              size={18}
              strokeWidth={2.5}
              className={
                reminders.length > 0
                  ? "animate-pulse"
                  : ""
              }
            />
          </div>

          {/* TITLE */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black text-gray-800">
              Reminder
            </p>

            <p className="mt-0.5 text-[10px] text-gray-400">
              {loading
                ? "Memuat reminder..."
                : reminders.length > 0
                  ? `${reminders.length} reminder aktif`
                  : "Tidak ada reminder aktif"}
            </p>
          </div>

          {/* ADD BUTTON */}
          {isAdmin && !collapsed && (
            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
              }}
              className="mr-2 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-pink-600 px-3 text-[10px] font-black text-white transition hover:bg-pink-700 active:scale-[0.98]"
            >
              <Plus
                size={15}
                strokeWidth={3}
              />

              <span className="hidden sm:inline">
                Tambah
              </span>
            </button>
          )}

          {/* COLLAPSE */}
          <button
            type="button"
            onClick={() =>
              setCollapsed(!collapsed)
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
            title={
              collapsed
                ? "Buka reminder"
                : "Sembunyikan pengaturan reminder"
            }
          >
            {collapsed ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronUp size={18} />
            )}
          </button>
        </div>

        {/* =====================
            COLLAPSED BAR
            SELALU TAMPIL JIKA
            ADA REMINDER
        ====================== */}
        {collapsed &&
          reminders.length > 0 && (
            <div className="relative flex h-11 items-center overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400">

              <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-pink-500 px-3 text-white">
                <BellRing
                  size={15}
                  className="animate-pulse"
                />
              </div>

              <div className="min-w-0 flex-1 overflow-hidden pl-11">

                <div className="animate-[marquee_18s_linear_infinite] whitespace-nowrap pr-8 text-xs font-black text-white">
                  {reminderText}
                </div>
              </div>
            </div>
          )}

        {/* =====================
            EXPANDED CONTENT
        ====================== */}
        {!collapsed && (
          <div>

            {/* =================
                RUNNING REMINDER
            ================== */}
            {reminders.length > 0 && (
              <div className="relative flex h-12 items-center overflow-hidden border-b border-pink-100 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400">

                <div className="absolute left-0 top-0 z-10 flex h-full items-center bg-pink-500 px-3 text-white">
                  <BellRing
                    size={16}
                    className="animate-pulse"
                  />
                </div>

                <div className="min-w-0 flex-1 overflow-hidden pl-12">

                  <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap pr-8 text-xs font-black text-white">
                    {reminderText}
                  </div>
                </div>
              </div>
            )}

            {/* =================
                ADD FORM
            ================== */}
            {isAdmin &&
              showForm && (
                <form
                  onSubmit={
                    handleCreate
                  }
                  className="border-b border-gray-100 bg-gray-50 p-3 sm:p-4"
                >
                  <div className="flex gap-2">

                    <input
                      autoFocus
                      value={message}
                      onChange={(e) =>
                        setMessage(
                          e.target.value
                        )
                      }
                      placeholder="Contoh: Meses coklat habis..."
                      className="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                    />

                    <button
                      type="submit"
                      disabled={
                        saving ||
                        !message.trim()
                      }
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-600 text-white transition hover:bg-pink-700 disabled:opacity-50"
                      title="Simpan"
                    >
                      {saving ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Plus
                          size={18}
                          strokeWidth={3}
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setMessage("");
                      }}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 transition hover:bg-gray-100"
                      title="Batal"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </form>
              )}

            {/* =================
                REMINDER LIST
            ================== */}
            {isAdmin && (
              <div className="p-3 sm:p-4">

                {loading ? (
                  <div className="flex items-center justify-center py-5">
                    <Loader2
                      size={20}
                      className="animate-spin text-pink-500"
                    />
                  </div>
                ) : reminders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center">

                    <BellRing
                      size={20}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-2 text-xs font-semibold text-gray-400">
                      Belum ada reminder aktif.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">

                    {reminders.map(
                      (reminder) => {
                        const isEditing =
                          editingId ===
                          reminder.id;

                        const isActionLoading =
                          actionLoadingId ===
                          reminder.id;

                        return (
                          <div
                            key={
                              reminder.id
                            }
                            className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                          >

                            {/* EDIT MODE */}
                            {isEditing ? (
                              <div className="flex gap-2">

                                <input
                                  autoFocus
                                  value={
                                    editingMessage
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setEditingMessage(
                                      e.target
                                        .value
                                    )
                                  }
                                  onKeyDown={(
                                    e
                                  ) => {
                                    if (
                                      e.key ===
                                      "Enter"
                                    ) {
                                      handleSaveEdit(
                                        reminder.id
                                      );
                                    }
                                  }}
                                  className="h-10 min-w-0 flex-1 rounded-xl border border-pink-200 bg-pink-50 px-3 text-xs font-semibold text-gray-700 outline-none focus:border-pink-400"
                                />

                                <button
                                  type="button"
                                  disabled={
                                    isActionLoading
                                  }
                                  onClick={() =>
                                    handleSaveEdit(
                                      reminder.id
                                    )
                                  }
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-600 text-white transition hover:bg-pink-700 disabled:opacity-50"
                                  title="Simpan perubahan"
                                >
                                  {isActionLoading ? (
                                    <Loader2
                                      size={
                                        16
                                      }
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Save
                                      size={
                                        16
                                      }
                                    />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={
                                    handleCancelEdit
                                  }
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                                  title="Batal"
                                >
                                  <X
                                    size={17}
                                  />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 sm:gap-3">

                                {/* ICON */}
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-base">
                                  🔔
                                </div>

                                {/* MESSAGE */}
                                <p className="min-w-0 flex-1 text-xs font-semibold leading-relaxed text-gray-700">
                                  {
                                    reminder.message
                                  }
                                </p>

                                {/* EDIT */}
                                <button
                                  type="button"
                                  disabled={
                                    isActionLoading
                                  }
                                  onClick={() =>
                                    handleStartEdit(
                                      reminder
                                    )
                                  }
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                                  title="Ubah"
                                >
                                  <Pencil
                                    size={15}
                                  />
                                </button>

                                {/* COMPLETE */}
                                <button
                                  type="button"
                                  disabled={
                                    isActionLoading
                                  }
                                  onClick={() =>
                                    handleComplete(
                                      reminder.id
                                    )
                                  }
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-50"
                                  title="Selesai"
                                >
                                  {isActionLoading ? (
                                    <Loader2
                                      size={
                                        16
                                      }
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Check
                                      size={
                                        17
                                      }
                                      strokeWidth={
                                        3
                                      }
                                    />
                                  )}
                                </button>

                                {/* DELETE */}
                                <button
                                  type="button"
                                  disabled={
                                    isActionLoading
                                  }
                                  onClick={() =>
                                    handleDelete(
                                      reminder.id
                                    )
                                  }
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                                  title="Hapus"
                                >
                                  <Trash2
                                    size={15}
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================
          ANIMATION
      ====================== */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}