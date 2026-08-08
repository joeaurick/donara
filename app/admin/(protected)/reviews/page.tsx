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
    setLoading(true);

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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
          <p className="text-sm font-medium text-gray-500">
            Memuat review...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-pink-500">
            Customer Feedback
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Kelola Review
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Semua ulasan pelanggan Donara dalam satu dashboard.
          </p>
        </div>

        <Link
          href="/admin/reviews/new"
          className="inline-flex items-center justify-center rounded-2xl bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition-all duration-200 hover:bg-pink-700 active:scale-[0.98]"
        >
          + Tambah Review
        </Link>
      </div>

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-pink-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-3xl">
            ⭐
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            Belum ada review
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Tambahkan review pertama untuk menampilkan testimoni pelanggan.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* Konten Review */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-gray-900">
                        {review.name}
                      </h2>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-lg text-yellow-400">
                          {"⭐".repeat(review.rating)}
                        </span>

                        <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-bold text-yellow-700">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-gray-400 sm:text-right">
                      {new Date(review.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm leading-7 text-gray-700">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Aksi */}
                <div className="flex shrink-0 gap-2 lg:flex-col">
                  <Link
                    href={`/admin/reviews/${review.id}`}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-600 transition-all duration-200 hover:bg-blue-100 lg:min-w-[110px]"
                  >
                    ✏️ Edit
                  </Link>

                  <button
                    onClick={() => deleteReview(review.id)}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-all duration-200 hover:bg-red-100 lg:min-w-[110px]"
                  >
                    🗑 Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}