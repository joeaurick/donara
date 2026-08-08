"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

export default function NewReviewPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  async function saveReview() {
    if (!form.name.trim() || !form.comment.trim()) {
      alert("Semua data wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("reviews")
      .insert({
        name: form.name.trim(),
        rating: form.rating,
        comment: form.comment.trim(),
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Review berhasil ditambahkan.");

    router.push("/admin/reviews");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-pink-500">
          Customer Feedback
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Tambah Review
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Tambahkan testimoni pelanggan untuk ditampilkan di website Donara.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-6">
          {/* Nama */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Nama Pelanggan
            </label>

            <input
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
              placeholder="Contoh: Budi Santoso"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          {/* Rating */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Rating
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[5, 4, 3, 2, 1].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      rating: value,
                    })
                  }
                  className={`rounded-2xl border px-4 py-3 text-center text-sm font-bold transition-all duration-200 ${
                    form.rating === value
                      ? "border-pink-500 bg-pink-50 text-pink-600 shadow-sm"
                      : "border-gray-200 bg-white text-gray-500 hover:border-pink-200 hover:bg-pink-50"
                  }`}
                >
                  <div className="text-base">{"⭐".repeat(value)}</div>
                  <div className="mt-1 text-xs">{value} Bintang</div>
                </button>
              ))}
            </div>
          </div>

          {/* Komentar */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Isi Review
            </label>

            <textarea
              rows={6}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition-all duration-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
              placeholder="Tuliskan pengalaman pelanggan terhadap produk atau layanan Donara..."
              value={form.comment}
              onChange={(e) =>
                setForm({
                  ...form,
                  comment: e.target.value,
                })
              }
            />

            <p className="mt-2 text-xs text-gray-400">
              {form.comment.length} karakter
            </p>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-pink-500">
              Preview
            </p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-gray-900">
                  {form.name || "Nama pelanggan"}
                </h3>

                <span className="text-sm text-yellow-400">
                  {"⭐".repeat(form.rating)}
                </span>
              </div>

              <p className="text-sm leading-6 text-gray-600">
                {form.comment ||
                  "Isi review akan tampil di sini sebagai preview sebelum disimpan."}
              </p>
            </div>
          </div>

          {/* Tombol */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={saveReview}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-pink-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition-all duration-200 hover:bg-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-pink-300 disabled:shadow-none"
            >
              {loading ? "Menyimpan..." : "Simpan Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}