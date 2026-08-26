"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowRight,
  ExternalLink,
  ImageIcon,
  Package,
  Plus,
  Sparkles,
  Star,
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
      description: "Total produk",
      icon: Package,
      href: "/admin/products",
      border: "border-pink-100",
      accent: "bg-pink-500",
      iconBg: "bg-pink-50",
      iconColor: "text-pink-600",
      badge: "bg-pink-50 text-pink-600",
      hover: "hover:border-pink-200",
    },
    {
      title: "Gallery",
      value: totalGallery,
      description: "Total gallery",
      icon: ImageIcon,
      href: "/admin/gallery",
      border: "border-orange-100",
      accent: "bg-orange-400",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      badge: "bg-orange-50 text-orange-600",
      hover: "hover:border-orange-200",
    },
    {
      title: "Review",
      value: totalReviews,
      description: "Total review",
      icon: Star,
      href: "/admin/reviews",
      border: "border-purple-100",
      accent: "bg-purple-500",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      badge: "bg-purple-50 text-purple-600",
      hover: "hover:border-purple-200",
    },
  ];

  const quickActions = [
    {
      title: "Kelola Produk",
      description: "Tambah, edit, dan kelola produk yang tampil di website.",
      icon: Package,
      href: "/admin/products",
      iconBg: "bg-pink-50",
      iconColor: "text-pink-600",
      border: "border-pink-100",
      accent: "bg-pink-500",
      hover: "hover:border-pink-200",
      label: "Produk",
      labelClass: "bg-pink-50 text-pink-600",
    },
    {
      title: "Kelola Gallery",
      description: "Upload dan atur foto untuk memperkuat tampilan brand.",
      icon: ImageIcon,
      href: "/admin/gallery",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      border: "border-orange-100",
      accent: "bg-orange-400",
      hover: "hover:border-orange-200",
      label: "Gallery",
      labelClass: "bg-orange-50 text-orange-600",
    },
    {
      title: "Moderasi Review",
      description: "Pantau dan kelola ulasan pelanggan yang tampil di website.",
      icon: Star,
      href: "/admin/reviews",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      border: "border-purple-100",
      accent: "bg-purple-500",
      hover: "hover:border-purple-200",
      label: "Review",
      labelClass: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          {/* Accent warna menu */}
          <div className="h-[3px] bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500" />

          <div className="relative p-5 sm:p-7 lg:p-9">
            {/* Decoration */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-pink-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-slate-500" />

                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-600">
                    Donara CMS
                  </span>
                </div>

                <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Dashboard
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                  Kelola seluruh konten Donara dari satu dashboard dengan lebih
                  cepat dan mudah.
                </p>
              </div>

              <div className="grid gap-2 sm:flex">
                <a
                  href="/admin/products"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Produk
                </a>

                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
                >
                  <ExternalLink className="h-4 w-4" />
                  Lihat Website
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RINGKASAN ================= */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-base font-black text-slate-900 sm:text-lg">
              Ringkasan Konten
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Statistik konten yang saat ini tersimpan di sistem.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  className={`group relative overflow-hidden rounded-[24px] border ${item.border} bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] ${item.hover} sm:p-5`}
                >
                  {/* Accent kiri */}
                  <div
                    className={`absolute bottom-0 left-0 top-0 w-[3px] ${item.accent}`}
                  />

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        {item.title}
                      </p>

                      <p className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        {item.value}
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${item.badge}`}
                      >
                        {item.description}
                      </span>
                    </div>

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.iconBg}`}
                    >
                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ================= KELOLA KONTEN ================= */}
        <section className="mt-7">
          <div className="mb-4">
            <h2 className="text-base font-black text-slate-900 sm:text-lg">
              Kelola Konten
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Pilih menu yang ingin Anda kelola.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
            {quickActions.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  className={`group relative overflow-hidden rounded-[24px] border ${item.border} bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)] ${item.hover}`}
                >
                  {/* Accent atas */}
                  <div
                    className={`absolute left-0 right-0 top-0 h-[3px] ${item.accent}`}
                  />

                  <div className="flex items-center justify-between gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconBg}`}
                    >
                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${item.labelClass}`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span>Buka Menu</span>

                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* ================= STATUS ================= */}
        <section className="mt-7 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.03)] sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-slate-900">
                Donara Content Management
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Kelola konten website Anda dari dashboard ini.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
                Aktif
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}