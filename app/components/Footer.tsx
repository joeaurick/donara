import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import { getBusinessProfile } from "@/lib/business";

export default async function Footer() {
  const data = await getBusinessProfile();

  return (
    <footer id="kontak" className="bg-[#2F2F2F] text-white">

      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-3">

          {/* Brand */}

          <div>

            <h2 className="text-4xl font-black text-pink-400">
              🍩 {data?.business_name}
            </h2>

            <p className="mt-5 leading-8 text-gray-300">
              {data?.about_description}
            </p>

          </div>

          {/* Kontak */}

          <div>

            <h3 className="mb-6 text-2xl font-bold">
              Kontak
            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-3">

                <MapPin size={20} />

                <span>
                  {data?.address}
                </span>

              </div>

              <div className="flex items-center gap-3">

                <Phone size={20} />

                <a
                  href={`https://wa.me/${data?.phone}?text=${encodeURIComponent(
                  data?.whatsapp_message ??
                   "Halo, saya ingin memesan donat."
                  )}`}
                  target="_blank"
                >
                  {data?.phone}
                </a>

              </div>

              <div className="flex items-center gap-3">

                <Mail size={20} />

                <a href={`mailto:${data?.email}`}>
                  {data?.email}
                </a>

              </div>

            </div>

          </div>

          {/* Jam */}

          <div>

            <h3 className="mb-6 text-2xl font-bold">
              Jam Operasional
            </h3>

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <Clock size={20} />

                <span>
                  {data?.opening_hours}
                </span>

              </div>

              <a
                href={data?.maps_url}
                target="_blank"
                className="inline-flex rounded-full bg-pink-600 px-6 py-3 font-semibold hover:bg-pink-700"
              >
                📍 Lihat Lokasi
              </a>

              <a
                href={`https://instagram.com/${(data?.instagram ?? "").replace("@","")}`}
                target="_blank"
                className="inline-flex items-center gap-3 rounded-full border border-pink-500 px-6 py-3 hover:bg-pink-500"
              >

                <span className="text-xl">📷</span>

                <span>{data?.instagram}</span>

              </a>

            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-gray-700 py-6 text-center text-gray-400">

        © {new Date().getFullYear()} {data?.business_name}. All Rights Reserved.

      </div>

    </footer>
  );
}