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

    const { error } = await supabase
      .from("reviews")
      .insert({
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
      className="bg-[#FFF8F3] py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-pink-100 px-5 py-2 text-sm font-semibold text-pink-600">
            ⭐ Review
          </span>

          <h2 className="mt-6 text-5xl font-black text-gray-900">
            Apa Kata Pelanggan?
          </h2>

          <p className="mt-5 text-gray-600">
            Berikan pengalaman Anda setelah menikmati Donara.
          </p>

        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">

          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <input
              className="mb-5 w-full rounded-xl border p-4"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              className="mb-5 w-full rounded-xl border p-4"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>⭐⭐⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={1}>⭐</option>
            </select>

            <textarea
              className="mb-5 h-40 w-full rounded-xl border p-4"
              placeholder="Tulis review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={submitReview}
              className="w-full rounded-full bg-pink-600 py-4 font-bold text-white transition hover:bg-pink-700"
            >
              Kirim Review
            </button>

          </div>

          <div className="space-y-5">

            {reviews.map((item) => (

              <div
                key={item.id}
                className="rounded-3xl bg-white p-6 shadow-md"
              >
                <div className="text-xl text-yellow-500">
                  {"⭐".repeat(item.rating)}
                </div>

                <h3 className="mt-2 text-xl font-bold">
                  {item.name}
                </h3>

                <p className="mt-3 text-gray-600">
                  {item.comment}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}