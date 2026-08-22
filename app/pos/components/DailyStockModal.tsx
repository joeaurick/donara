"use client";

import { useState } from "react";
import { saveTodayStock } from "@/lib/supabase/daily-stock";
import NumericKeypad from "@/app/components/ui/NumericKeypad";

type Props = {
  open: boolean;
  onSaved: () => void;
};

export default function DailyStockModal({
  open,
  onSaved,
}: Props) {
  const [stock, setStock] = useState("150");
  const [loading, setLoading] = useState(false);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);

  if (!open) {
    return null;
  }

  function openKeypad() {
    if (loading) return;

    setIsKeypadOpen(true);
  }

  function closeKeypad() {
    if (loading) return;

    setIsKeypadOpen(false);
  }

  function handleStockChange(value: string) {
    setStock(value);
  }

  function handleKeypadDone() {
    setIsKeypadOpen(false);
  }

  async function handleSave() {
    const stockValue = Number(stock);

    if (!stock || Number.isNaN(stockValue)) {
      alert("Masukkan jumlah stok terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);

      await saveTodayStock(stockValue);

      setIsKeypadOpen(false);

      onSaved();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Modal Stok */}
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-pink-600">
            Stok Hari Ini
          </h2>

          <p className="mt-2 text-gray-500">
            Masukkan jumlah donat yang tersedia hari ini.
          </p>

          {/* Input Stok */}
          <div className="mt-6">
            <button
              type="button"
              onClick={openKeypad}
              disabled={loading}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center text-3xl font-black text-gray-900 transition hover:border-pink-300 hover:bg-pink-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {stock || "0"}
            </button>

            <p className="mt-2 text-center text-xs text-gray-400">
              Tekan jumlah stok untuk mengubah angka
            </p>
          </div>

          {/* Simpan */}
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700 active:scale-[0.98] disabled:bg-gray-300"
          >
            {loading ? "Menyimpan..." : "Mulai Hari Ini"}
          </button>
        </div>
      </div>

      {/* Numeric Keypad */}
      <NumericKeypad
        isOpen={isKeypadOpen}
        onClose={closeKeypad}
        value={stock}
        onChange={handleStockChange}
        maxLength={5}
        title="Masukkan Stok Donat"
        description="Masukkan jumlah donat yang tersedia hari ini."
        disabled={loading}
        onDone={handleKeypadDone}
      />
    </>
  );
}