import Image from "next/image";

import { getSeoSettings } from "@/lib/seo";
import { getBusinessProfile } from "@/lib/business";
import { getHomepageContent } from "@/lib/homepage";

export default async function Hero() {
  const seo = await getSeoSettings();
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
    <section className="relative overflow-hidden bg-[#FFF8F3] pt-32 pb-20">

      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl"></div>
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl"></div>

      <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-16 px-6 lg:flex-row">

        <div className="flex-1 text-center lg:text-left">

          <span className="inline-block rounded-full bg-pink-100 px-5 py-2 text-sm font-semibold text-pink-600">
            🍩 {business?.tagline || "Fresh Every Day"}
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
            {seo?.homepage_h1 ||
              homepage?.hero_title ||
              "Donat Premium Fresh dengan Topping Melimpah di Bekasi Barat"}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">
            {homepage?.hero_description ||
              "Dibuat setiap hari menggunakan bahan premium, tekstur lembut, topping melimpah, dan rasa yang membuat pelanggan selalu ingin kembali."}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">

            <a
              href="#menu"
              className="rounded-full bg-pink-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-pink-700"
            >
              Lihat Menu
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-pink-600 px-8 py-4 font-semibold text-pink-600 transition hover:bg-pink-600 hover:text-white"
            >
              Pesan Sekarang
            </a>

          </div>

          <div className="mt-14 grid grid-cols-3 gap-8 border-t border-pink-100 pt-8">

            <div>
              <h3 className="text-4xl font-black text-pink-600">
                500+
              </h3>
              <p className="mt-2 text-gray-600">
                Pelanggan
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-pink-600">
                4
              </h3>
              <p className="mt-2 text-gray-600">
                Varian
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black text-pink-600">
                4.9★
              </h3>
              <p className="mt-2 text-gray-600">
                Rating
              </p>
            </div>

          </div>

        </div>

        <div className="relative flex flex-1 justify-center">

          <div className="absolute h-[420px] w-[420px] rounded-full bg-pink-200 opacity-50 blur-3xl"></div>

          <Image
            src="/images/hero/donat-gula-halus.png"
            alt={business?.business_name || "Donara"}
            width={650}
            height={650}
            priority
            className="relative z-10 w-full max-w-lg drop-shadow-2xl transition duration-500 hover:scale-105"
          />

        </div>

      </div>

    </section>
  );
}