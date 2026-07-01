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
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-pink-100 px-5 py-2 text-sm font-semibold text-pink-600">
            Tentang {business?.business_name || "Donara"}
          </span>

          <h2 className="mt-6 text-4xl font-black text-[#2F2F2F] md:text-5xl">
            {homepage?.about_title ||
              "Donat Premium yang Dibuat Fresh Setiap Hari"}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            {homepage?.about_description ||
              "Donara hadir untuk menghadirkan pengalaman menikmati donat yang lembut, lezat, dan dibuat menggunakan bahan-bahan pilihan."}
          </p>

        </div>

        {/* CARD TIDAK BERUBAH */}

      </div>

    </section>
  );
}