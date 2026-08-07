import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import { getBusinessProfile } from "@/lib/business";

export default async function Footer() {
  const data = await getBusinessProfile();

  const instagramUsername = (data?.instagram ?? "").replace("@", "");

  return (
    <footer className="relative overflow-hidden bg-[#111827] text-white">
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <span className="text-2xl">🍩</span>
              <span className="text-sm font-semibold text-pink-300">
                {data?.business_name || "Donara"}
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Donat Fresh dengan Rasa yang Selalu Membuat Ingin Kembali
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
              {data?.about_description ||
                "Donara menghadirkan donat lembut, fresh setiap hari, dan dibuat menggunakan bahan pilihan untuk menemani momen spesial Anda."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300 sm:text-sm">
              <div className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
                ✨ Fresh setiap hari
              </div>
              <div className="rounded-full bg-white/5 px-3 py-2 ring-1 ring-white/10">
                🚚 Siap dipesan via WhatsApp
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xl font-bold text-white">Kontak</h3>

            <div className="mt-6 space-y-5 text-sm text-slate-300 sm:text-base">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <MapPin size={18} className="text-pink-300" />
                </div>

                <a
                  href={data?.maps_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-6 transition hover:text-pink-300"
                >
                  {data?.address || "Alamat Donara"}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Phone size={18} className="text-pink-300" />
                </div>

                <a
                  href={`https://wa.me/${data?.phone}?text=${encodeURIComponent(
                    data?.whatsapp_message ||
                      "Halo, saya ingin memesan donat."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-pink-300"
                >
                  {data?.phone || "-"}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Mail size={18} className="text-pink-300" />
                </div>

                <a
                  href={`mailto:${data?.email}`}
                  className="transition hover:text-pink-300"
                >
                  {data?.email || "-"}
                </a>
              </div>
            </div>
          </div>

          {/* Jam & Sosial */}
          <div>
            <h3 className="text-xl font-bold text-white">
              Jam Operasional
            </h3>

            <div className="mt-6 space-y-5 text-sm text-slate-300 sm:text-base">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Clock size={18} className="text-pink-300" />
                </div>

                <span className="leading-6">
                  {data?.opening_hours || "Setiap Hari"}
                </span>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={data?.maps_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:to-orange-600"
                >
                  📍 Lihat Lokasi
                </a>

                {instagramUsername && (
                  <a
                    href={`https://instagram.com/${instagramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition-all duration-300 hover:border-pink-300 hover:bg-pink-500/10 hover:text-pink-200"
                  >
                    <span className="text-base">📷</span>
                    <span>{data?.instagram}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-slate-400 sm:px-6 sm:text-sm lg:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} {data?.business_name || "Donara"}.
            All Rights Reserved.
          </p>

          <p className="text-slate-500">
            Dibuat dengan ❤️ untuk pecinta donat Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}