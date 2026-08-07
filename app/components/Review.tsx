"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
};

export default function Review() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function loadReviews() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setReviews(data);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function submitReview() {
    if (!name || !comment) {
      alert("Lengkapi data terlebih dahulu.");
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      name,
      rating,
      comment,
    });

    if (error) {
      alert("Gagal mengirim review.");
      console.error(error);
      return;
    }

    setName("");
    setRating(5);
    setComment("");

    loadReviews();
  }

  return (
    <section
      id="review"
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-pink-100/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm backdrop-blur sm:px-5 sm:text-sm">
            <span>⭐</span>
            <span>Review Pelanggan</span>
          </span>

          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Apa Kata Pelanggan?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Berikan pengalaman Anda setelah menikmati Donara dan bantu pelanggan
            lain menemukan donat favorit mereka.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
          {/* Form */}
          <div className="rounded-[2rem] border border-pink-100 bg-white/80 p-6 shadow-lg backdrop-blur sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Tulis Review
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Ceritakan pengalaman Anda menikmati Donara agar kami dapat terus
                meningkatkan kualitas rasa dan pelayanan.
              </p>
            </div>

            <div className="space-y-4">
              <input
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 sm:text-base"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 sm:text-base"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={5}>⭐⭐⭐⭐⭐ Sangat Puas</option>
                <option value={4}>⭐⭐⭐⭐ Puas</option>
                <option value={3}>⭐⭐⭐ Cukup</option>
                <option value={2}>⭐⭐ Kurang</option>
                <option value={1}>⭐ Tidak Puas</option>
              </select>

              <textarea
                className="h-36 w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100 sm:h-40 sm:text-base"
                placeholder="Tulis pengalaman Anda menikmati Donara..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                onClick={submitReview}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:to-orange-600 hover:shadow-xl sm:h-14 sm:text-base"
              >
                Kirim Review
              </button>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4 sm:space-y-5">
            {reviews.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-pink-200 bg-white/70 p-8 text-center shadow-sm backdrop-blur">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-2xl">
                  ⭐
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Belum ada review
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Jadilah pelanggan pertama yang membagikan pengalaman menikmati
                  donat Donara.
                </p>
              </div>
            ) : (
              reviews.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-[2rem] border border-pink-100 bg-white/80 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-1 text-sm text-yellow-500">
                        {Array.from({ length: item.rating }).map((_, index) => (
                          <span key={index}>⭐</span>
                        ))}
                      </div>
                    </div>

                    <div className="hidden rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 sm:block">
                      Pelanggan
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                    {item.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}