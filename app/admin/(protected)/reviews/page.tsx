"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setReviews(data || []);
    setLoading(false);
  }

  async function deleteReview(id: number) {
    const ok = confirm("Yakin ingin menghapus review ini?");

    if (!ok) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadReviews();
  }

  if (loading) {
    return (
      <main className="p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="p-10">

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-black text-pink-600">
            Kelola Review
          </h1>

          <p className="mt-2 text-gray-500">
            Semua review pelanggan.
          </p>

        </div>

        <Link
          href="/admin/reviews/new"
          className="rounded-full bg-pink-600 px-6 py-3 font-bold text-white hover:bg-pink-700"
        >
          + Tambah Review
        </Link>

      </div>

      <div className="space-y-6">

        {reviews.length === 0 && (
          <div className="rounded-2xl bg-white p-8 shadow">
            Belum ada review.
          </div>
        )}

        {reviews.map((review) => (

          <div
            key={review.id}
            className="rounded-3xl bg-white p-8 shadow-lg"
          >

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  {review.name}
                </h2>

                <p className="mt-2 text-xl text-yellow-500">
                  {"⭐".repeat(review.rating)}
                </p>

                <p className="mt-4 text-gray-600">
                  {review.comment}
                </p>

                <p className="mt-4 text-sm text-gray-400">
                  {new Date(review.created_at).toLocaleString("id-ID")}
                </p>

              </div>

              <div className="flex gap-3">

                <Link
                  href={`/admin/reviews/${review.id}`}
                  className="rounded-xl bg-blue-500 px-5 py-3 font-bold text-white hover:bg-blue-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteReview(review.id)}
                  className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600"
                >
                  Hapus
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}