"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    loadReview();
  }, []);

  async function loadReview() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", Number(params.id))
      .maybeSingle();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setForm({
        name: data.name,
        rating: data.rating,
        comment: data.comment,
      });
    }

    setLoading(false);
  }

  async function updateReview() {
  if (!form.name || !form.comment) {
    alert("Semua data wajib diisi.");
    return;
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({
      name: form.name,
      rating: form.rating,
      comment: form.comment,
    })
    .eq("id", Number(params.id))
    .select();

  console.log("UPDATE DATA:", data);
  console.log("UPDATE ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Review berhasil diperbarui.");

  router.push("/admin/reviews");
  router.refresh();
}

  if (loading) {
    return (
      <main className="p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8F3] p-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="mb-8 text-4xl font-black text-pink-600">
          Edit Review
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
              onClick={updateReview}
              className="w-1/2 rounded-full bg-pink-600 py-4 font-bold text-white"
            >
              Simpan Perubahan
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}