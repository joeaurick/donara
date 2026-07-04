"use client";

import { useState } from "react";
import { saveTodayStock } from "@/lib/supabase/daily-stock";

type Props = {
  open: boolean;
  onSaved: () => void;
};

export default function DailyStockModal({
  open,
  onSaved,
}: Props) {
  const [stock, setStock] = useState(150);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSave() {
    try {
      setLoading(true);

      await saveTodayStock(stock);

      onSaved();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-3xl bg-white p-8">

        <h2 className="text-2xl font-black text-pink-600">
          Stok Hari Ini
        </h2>

        <p className="mt-2 text-gray-500">
          Masukkan jumlah donat yang tersedia hari ini.
        </p>

        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className="mt-6 w-full rounded-2xl border p-4 text-center text-3xl font-black"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-pink-600 py-4 font-bold text-white disabled:bg-gray-300"
        >
          {loading ? "Menyimpan..." : "Mulai Hari Ini"}
        </button>

      </div>

    </div>
  );
}