"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AdminPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalGallery, setTotalGallery] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const [
      { count: productCount },
      { count: galleryCount },
      { count: reviewCount },
    ] = await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("gallery")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("reviews")
        .select("*", { count: "exact", head: true }),
    ]);

    setTotalProducts(productCount || 0);
    setTotalGallery(galleryCount || 0);
    setTotalReviews(reviewCount || 0);
  }

  return (
    <main className="p-10">

      <h1 className="text-5xl font-black text-pink-600">
        Dashboard Donara
      </h1>

      <p className="mt-3 text-gray-600">
        Selamat datang di Dashboard Admin.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">

        <div className="rounded-3xl bg-white p-8 shadow-lg">

          <h2 className="text-lg text-gray-500">
            🍩 Produk
          </h2>

          <p className="mt-3 text-5xl font-black text-pink-600">
            {totalProducts}
          </p>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">

          <h2 className="text-lg text-gray-500">
            🖼 Gallery
          </h2>

          <p className="mt-3 text-5xl font-black text-pink-600">
            {totalGallery}
          </p>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg">

          <h2 className="text-lg text-gray-500">
            ⭐ Review
          </h2>

          <p className="mt-3 text-5xl font-black text-pink-600">
            {totalReviews}
          </p>

        </div>

      </div>

    </main>
  );
}