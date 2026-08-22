"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import NumericKeypad from "@/app/components/ui/NumericKeypad";

type VoidTransactionButtonProps = {
  transactionId: number;
  invoice: string;
};

export default function VoidTransactionButton({
  transactionId,
  invoice,
}: VoidTransactionButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);

  function closeModal() {
    if (isLoading) return;

    setIsOpen(false);
    setIsKeypadOpen(false);
    setPin("");
    setReason("");
  }

  async function handleVoid() {
    if (!pin.trim()) {
      alert("Masukkan PIN terlebih dahulu.");
      return;
    }

    if (!reason.trim()) {
      alert("Masukkan alasan void.");
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "User tidak ditemukan. Silakan login kembali."
        );
      }

      const { data: isPinValid, error: pinError } =
        await supabase.rpc("verify_void_pin", {
          p_user_id: user.id,
          p_pin: pin,
        });

      if (pinError) {
        throw pinError;
      }

      if (!isPinValid) {
        alert("PIN salah.");
        setPin("");
        setIsKeypadOpen(true);
        return;
      }

      const { error: voidError } = await supabase
        .from("transactions")
        .update({
          status: "VOID",
          voided_at: new Date().toISOString(),
          voided_by: user.id,
          void_reason: reason.trim(),
        })
        .eq("id", transactionId)
        .eq("status", "COMPLETED");

      if (voidError) {
        throw voidError;
      }

      alert(`Transaksi ${invoice} berhasil di-VOID.`);

      setIsOpen(false);
      setIsKeypadOpen(false);
      setPin("");
      setReason("");

      router.refresh();
    } catch (error) {
      console.error("VOID TRANSACTION ERROR:", error);

      alert(
        "Gagal melakukan void: " +
          (error instanceof Error
            ? error.message
            : "Terjadi kesalahan")
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-700 active:scale-[0.98]"
      >
        Void Transaksi
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <div className="text-2xl">⚠️</div>

              <h2 className="mt-3 text-xl font-black text-gray-900">
                Void Transaksi
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Invoice:{" "}
                <span className="font-bold text-gray-800">
                  {invoice}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-medium leading-5 text-red-600">
              Tindakan ini akan mengubah status transaksi menjadi VOID.
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">
                Alasan Void
              </label>

              <textarea
                value={reason}
                onFocus={() => setIsKeypadOpen(false)}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Salah input transaksi"
                rows={3}
                disabled={isLoading}
                className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-red-500"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-gray-500">
                PIN Otorisasi
              </label>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => setIsKeypadOpen(true)}
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-center text-lg font-black tracking-[0.5em] outline-none transition hover:border-red-300 focus:border-red-500 disabled:cursor-not-allowed disabled:bg-gray-50"
              >
                {pin
                  ? "•".repeat(pin.length)
                  : "Masukkan PIN"}
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={closeModal}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleVoid}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:bg-gray-300"
              >
                {isLoading
                  ? "Memproses..."
                  : "Konfirmasi Void"}
              </button>
            </div>
          </div>
        </div>
      )}

      <NumericKeypad
        isOpen={isKeypadOpen}
        onClose={() => setIsKeypadOpen(false)}
        value={pin}
        onChange={setPin}
        maxLength={6}
        title="Masukkan PIN"
        description="Gunakan PIN otorisasi untuk melanjutkan proses void."
        disabled={isLoading}
      />
    </>
  );
}