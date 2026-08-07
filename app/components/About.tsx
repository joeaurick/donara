import {
  Award,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

import { getBusinessProfile } from "@/lib/business";
import { getHomepageContent } from "@/lib/homepage";

export default async function About() {
  const business = await getBusinessProfile();
  const homepage = await getHomepageContent();

  return (
    <section
      id="about"
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-pink-100/40 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm backdrop-blur sm:px-5 sm:text-sm">
            <span>🍩</span>
            <span>
              Tentang {business?.business_name || "Donara"}
            </span>
          </span>

          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {homepage?.about_title ||
              "Donat Premium yang Dibuat Fresh Setiap Hari"}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            {homepage?.about_description ||
              "Donara hadir untuk menghadirkan pengalaman menikmati donat yang lembut, lezat, dan dibuat menggunakan bahan-bahan pilihan dengan proses produksi yang selalu mengutamakan kualitas dan kebersihan."}
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          <div className="group rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/20">
              <Award className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Bahan Berkualitas
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Menggunakan bahan pilihan untuk menghasilkan tekstur donat yang
              lembut, empuk, dan konsisten setiap hari.
            </p>
          </div>

          <div className="group rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/20">
              <Sparkles className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Fresh Setiap Hari
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Diproduksi setiap hari agar pelanggan selalu mendapatkan donat
              yang fresh dengan aroma dan rasa terbaik.
            </p>
          </div>

          <div className="group rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20">
              <HeartHandshake className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Dibuat dengan Sepenuh Hati
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Setiap donat dibuat dengan perhatian pada detail agar cocok untuk
              camilan keluarga, hadiah, maupun acara spesial Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}