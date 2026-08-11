import Image from "next/image";

import { getSeoSettings } from "@/lib/seo";
import { getBusinessProfile } from "@/lib/business";
import { getHomepageContent } from "@/lib/homepage";

export default async function Hero() {
  const seo = await getSeoSettings();
  const business = await getBusinessProfile();
  const homepage = await getHomepageContent();
  const heroImage =
  homepage?.hero_image_url ||
  "/images/hero/donat-gula-halus.png";

  const whatsappNumber = business?.phone ?? "";

  const whatsappMessage =
    homepage?.whatsapp_message ??
    "Halo Donara, saya ingin memesan donat.";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-24">
      {/* Background glow */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-orange-200/25 blur-3xl sm:h-96 sm:w-96" />

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 lg:flex-row lg:gap-20">
        {/* Content */}
        <div className="w-full flex-1 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm backdrop-blur sm:px-5 sm:text-sm">
            <span>🍩</span>
            <span>{business?.tagline || "Fresh Every Day"}</span>
          </span>

          <h1 className="mt-5 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
            {seo?.homepage_h1 ||
              homepage?.hero_title ||
              "Donat Premium Fresh dengan Topping Melimpah di Bekasi Barat"}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:mx-0">
            {homepage?.hero_description ||
              "Dibuat setiap hari menggunakan bahan premium, tekstur lembut, topping melimpah, dan rasa yang membuat pelanggan selalu ingin kembali."}
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#menu"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:to-orange-600 hover:shadow-xl sm:h-14 sm:px-8 sm:text-base"
            >
              Lihat Menu
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-pink-500 bg-white/90 px-6 text-sm font-semibold text-pink-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-600 hover:text-white hover:shadow-lg sm:h-14 sm:px-8 sm:text-base"
            >
              Pesan Sekarang
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-pink-100 pt-6 sm:mt-12 sm:gap-6 sm:pt-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-black text-pink-600 sm:text-3xl lg:text-4xl">
                500+
              </h3>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Pelanggan
              </p>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-black text-pink-600 sm:text-3xl lg:text-4xl">
                4
              </h3>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Varian
              </p>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-black text-pink-600 sm:text-3xl lg:text-4xl">
                4.9★
              </h3>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Rating
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex w-full flex-1 justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-pink-200/50 to-orange-200/40 blur-3xl sm:h-80 sm:w-80 lg:h-[420px] lg:w-[420px]" />

          <div className="relative w-full max-w-3xl">
  <div className="relative flex w-full flex-1 justify-center">
  <div className="relative w-full max-w-3xl">
    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-pink-200/40 to-orange-200/30 blur-3xl" />

    <div className="relative overflow-hidden rounded-[2rem] bg-white/70 p-3 shadow-2xl ring-1 ring-pink-100 backdrop-blur sm:p-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.5rem]">
        <Image
          src={heroImage}
          alt={business?.business_name || "Donara"}
          fill
          priority
          className="object-cover object-center transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  </div>
</div>
</div>
        </div>
      </div>
    </section>
  );
}