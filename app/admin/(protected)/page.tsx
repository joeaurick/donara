"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Package,
  ImageIcon,
  Star,
  Plus,
  ExternalLink,
  Sparkles,
} from "lucide-react";

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

  const stats = [
    {
      title: "Produk",
      value: totalProducts,
      icon: Package,
      gradient: "from-pink-500 to-rose-500",
      bg: "bg-pink-50",
    },
    {
      title: "Gallery",
      value: totalGallery,
      icon: ImageIcon,
      gradient: "from-orange-400 to-amber-500",
      bg: "bg-orange-50",
    },
    {
      title: "Review",
      value: totalReviews,
      icon: Star,
      gradient: "from-fuchsia-500 to-pink-600",
      bg: "bg-fuchsia-50",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff8f7] via-[#fffdfc] to-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2rem] border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/30 sm:p-8 lg:p-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-200/30 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-orange-200/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
                <Sparkles className="h-4 w-4" />
                Donara CMS
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Dashboard Admin
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Kelola produk, gallery, dan review pelanggan Donara dengan cepat
                melalui dashboard yang lebih modern dan profesional.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/admin/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:to-rose-600 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Tambah Produk
              </a>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-5 text-sm font-semibold text-pink-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
              >
                <ExternalLink className="h-4 w-4" />
                Lihat Website
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-pink-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/40 sm:p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-transparent to-orange-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                      {item.value}
                    </p>

                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      Total data
                    </p>
                  </div>

                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <a
            href="/admin/products"
            className="group rounded-[1.75rem] border border-pink-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg sm:p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 transition-transform duration-300 group-hover:scale-105">
              <Package className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Kelola Produk
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tambah, edit, dan atur stok serta kategori produk Donara dengan
              lebih mudah.
            </p>
          </a>

          <a
            href="/admin/gallery"
            className="group rounded-[1.75rem] border border-pink-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg sm:p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-500 transition-transform duration-300 group-hover:scale-105">
              <ImageIcon className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Kelola Gallery
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload dan atur foto donat premium untuk memperkuat tampilan brand
              Donara.
            </p>
          </a>

          <a
            href="/admin/reviews"
            className="group rounded-[1.75rem] border border-pink-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg sm:p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600 transition-transform duration-300 group-hover:scale-105">
              <Star className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Moderasi Review
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Pantau ulasan pelanggan dan jaga reputasi Donara tetap positif dan
              terpercaya.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}