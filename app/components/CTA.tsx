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
    <section className="bg-pink-600 py-24">

      <div className="mx-auto max-w-6xl px-6">

        <div className="rounded-[40px] bg-white p-10 text-center shadow-2xl md:p-16">

          <span className="rounded-full bg-pink-100 px-5 py-2 text-sm font-semibold text-pink-600">
            {business?.business_name || "Donara"}
          </span>

          <h2 className="mt-6 text-4xl font-black text-gray-900 md:text-5xl">
            {homepage?.cta_title ||
              "Siap Menikmati Donat Fresh Hari Ini?"}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            {homepage?.cta_description ||
              "Donat dibuat setiap hari menggunakan bahan pilihan."}
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-pink-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-pink-700"
          >
            <MessageCircle size={22} />
            Pesan via WhatsApp
          </a>

        </div>

      </div>

    </section>
  );
}