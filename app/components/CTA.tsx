import { MessageCircle } from "lucide-react";

import { getBusinessProfile } from "@/lib/business";
import { getHomepageContent } from "@/lib/homepage";

export default async function CTA() {
  const business = await getBusinessProfile();
  const homepage = await getHomepageContent();

  const whatsappNumber = business?.phone ?? "";

  const whatsappMessage =
    homepage?.whatsapp_message ??
    "Halo Donara, saya ingin memesan donat.";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-100/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-pink-100 bg-white/85 p-8 text-center shadow-2xl shadow-pink-100/20 backdrop-blur sm:rounded-[2.5rem] sm:p-10 lg:p-16">
          {/* Decorative Glow */}
          <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-pink-200/30 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-orange-200/30 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm sm:px-5 sm:text-sm">
              <span>🍩</span>
              <span>{business?.business_name || "Donara"}</span>
            </span>

            <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {homepage?.cta_title ||
                "Siap Menikmati Donat Fresh Hari Ini?"}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {homepage?.cta_description ||
                "Donat dibuat setiap hari menggunakan bahan pilihan dengan tekstur lembut, topping melimpah, dan rasa yang selalu membuat pelanggan ingin kembali lagi."}
            </p>

            {/* Highlight mini stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-600 sm:gap-5">
              <div className="flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2">
                <span>✨</span>
                <span>Fresh setiap hari</span>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2">
                <span>🚚</span>
                <span>Pesan cepat via WhatsApp</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10 flex justify-center">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:to-orange-600 hover:shadow-xl sm:h-14 sm:px-8 sm:text-base lg:h-16 lg:px-10 lg:text-lg"
              >
                <MessageCircle
                  size={22}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span>Pesan via WhatsApp</span>
              </a>
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-500 sm:text-sm">
              Balasan cepat • Pemesanan mudah • Cocok untuk camilan, hadiah,
              dan acara spesial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}