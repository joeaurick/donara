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
    if (!form.name || !form.comment) {
      alert("Semua data wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("reviews")
      .insert({
        name: form.name,
        rating: form.rating,
        comment: form.comment,
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
    <main className="min-h-screen bg-[#FFF8F3] p-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="mb-8 text-4xl font-black text-pink-600">
          Tambah Review
        </h1>

        <div className="space-y-6">

          <input
            className="w-full rounded-xl border p-4"
            placeholder="Nama Pelanggan"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <select
            className="w-full rounded-xl border p-4"
            value={form.rating}
            onChange={(e) =>
              setForm({
                ...form,
                rating: Number(e.target.value),
              })
            }
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>

          <textarea
            className="h-40 w-full rounded-xl border p-4"
            placeholder="Isi Review"
            value={form.comment}
            onChange={(e) =>
              setForm({
                ...form,
                comment: e.target.value,
              })
            }
          />

          <div className="flex gap-4">

            <button
              onClick={() => router.back()}
              className="w-1/2 rounded-full border py-4"
            >
              Batal
            </button>

            <button
              onClick={saveReview}
              disabled={loading}
              className="w-1/2 rounded-full bg-pink-600 py-4 font-bold text-white"
            >
              {loading ? "Menyimpan..." : "Simpan Review"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}