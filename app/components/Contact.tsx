import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { createClient } from "@/lib/supabase/server";

export default async function Contact() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("business_profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const instagramUsername = (data?.instagram ?? "").replace("@", "");

  return (
    <section
      id="kontak"
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-10 h-64 w-64 rounded-full bg-pink-100/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm backdrop-blur sm:px-5 sm:text-sm">
            <span>📍</span>
            <span>Kontak</span>
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Hubungi
            <span className="block bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              {data?.business_name || "Donara"}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Kami siap menerima pesanan setiap hari dan membantu Anda mendapatkan
            donat fresh terbaik untuk camilan maupun acara spesial.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
          {/* Contact Card */}
          <div className="rounded-[2rem] border border-pink-100 bg-white/85 p-6 shadow-lg backdrop-blur sm:p-8 lg:p-10">
            <div className="space-y-5">
              <div className="flex items-start gap-4 rounded-2xl border border-pink-50 bg-pink-50/60 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-pink-100">
                  <MapPin className="h-5 w-5 text-pink-600" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    Alamat
                  </h3>

                  <a
                    href={data?.maps_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm leading-6 text-slate-600 transition hover:text-pink-600 sm:text-base"
                  >
                    {data?.address || "Alamat Donara"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-pink-50 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
                  <Phone className="h-5 w-5 text-pink-600" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    WhatsApp
                  </h3>

                  <a
                    href={`https://wa.me/${data?.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-slate-600 transition hover:text-pink-600 sm:text-base"
                  >
                    {data?.phone || "-"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-pink-50 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
                  <Mail className="h-5 w-5 text-pink-600" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    Email
                  </h3>

                  <a
                    href={`mailto:${data?.email}`}
                    className="mt-1 block text-sm text-slate-600 transition hover:text-pink-600 sm:text-base"
                  >
                    {data?.email || "-"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-pink-50 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
                  <FaInstagram className="text-xl text-pink-600" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    Instagram
                  </h3>

                  <a
                    href={`https://instagram.com/${instagramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-slate-600 transition hover:text-pink-600 sm:text-base"
                  >
                    {data?.instagram || "-"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-pink-50 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100">
                  <Clock className="h-5 w-5 text-pink-600" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    Jam Operasional
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
                    {data?.opening_hours || "Setiap Hari"}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${data?.phone}?text=${encodeURIComponent(
                data?.whatsapp_message ||
                  "Halo, saya ingin memesan donat."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-orange-500 px-6 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-700 hover:to-orange-600 hover:shadow-xl sm:h-14 sm:text-base"
            >
              Pesan via WhatsApp
            </a>
          </div>

          {/* Maps */}
          <div className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-pink-100 bg-pink-50/60 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                  Lokasi Donara
                </h3>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Temukan lokasi kami dengan mudah melalui Google Maps
                </p>
              </div>

              <a
                href={data?.maps_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-600 hover:text-white sm:inline-flex"
              >
                Buka Maps
              </a>
            </div>

            <iframe
              src={
                data?.maps_embed ||
                "https://www.google.com/maps?q=Bekasi&output=embed"
              }
              width="100%"
              height="100%"
              loading="lazy"
              className="min-h-[320px] border-0 sm:min-h-[420px] lg:min-h-[560px]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}