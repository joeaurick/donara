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
    .single();

  const instagramUsername = (data?.instagram ?? "").replace("@", "");

  return (
    <section
      id="kontak"
      className="bg-[#FFF8F3] py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="inline-block rounded-full bg-pink-100 px-6 py-2 text-sm font-semibold text-pink-600">
            📍 Kontak
          </span>

          <h2 className="mt-6 text-4xl font-black text-gray-900 md:text-6xl">
            Hubungi
            <span className="block text-pink-600">
              {data?.business_name}
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Kami siap menerima pesanan setiap hari.
          </p>

        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">

          <div className="space-y-6 rounded-3xl bg-white p-10 shadow-lg">

            <div className="flex items-center gap-5">

              <div className="rounded-full bg-pink-100 p-4">
                <MapPin className="text-pink-600" />
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Alamat
                </h3>

                <a
                  href={data?.maps_url}
                  target="_blank"
                  className="text-gray-600 hover:text-pink-600"
                >
                  {data?.address}
                </a>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <div className="rounded-full bg-pink-100 p-4">
                <Phone className="text-pink-600" />
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  WhatsApp
                </h3>

                <a
                  href={`https://wa.me/${data?.phone}`}
                  target="_blank"
                  className="text-gray-600 hover:text-pink-600"
                >
                  {data?.phone}
                </a>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <div className="rounded-full bg-pink-100 p-4">
                <Mail className="text-pink-600" />
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Email
                </h3>

                <a
                  href={`mailto:${data?.email}`}
                  className="text-gray-600 hover:text-pink-600"
                >
                  {data?.email}
                </a>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <div className="rounded-full bg-pink-100 p-4">
                <FaInstagram className="text-2xl text-pink-600" />
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Instagram
                </h3>

                <a
                  href={`https://instagram.com/${instagramUsername}`}
                  target="_blank"
                  className="text-gray-600 hover:text-pink-600"
                >
                  {data?.instagram}
                </a>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <div className="rounded-full bg-pink-100 p-4">
                <Clock className="text-pink-600" />
              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Jam Operasional
                </h3>

                <p className="text-gray-600">
                  {data?.opening_hours}
                </p>

              </div>

            </div>

            <a
              href={`https://wa.me/${data?.phone}?text=${encodeURIComponent(
  data?.whatsapp_message ||
    "Halo, saya ingin memesan donat."
)}`}
              target="_blank"
              className="mt-8 inline-block rounded-full bg-pink-600 px-8 py-4 font-bold text-white transition hover:scale-105 hover:bg-pink-700"
            >
              Pesan via WhatsApp
            </a>

          </div>

          <div className="overflow-hidden rounded-3xl shadow-lg">

            <iframe
  src={
    data?.maps_embed ||
    "https://www.google.com/maps?q=Bekasi&output=embed"
  }
              width="100%"
              height="100%"
              loading="lazy"
              className="min-h-[500px] border-0"
            />

          </div>

        </div>

      </div>
    </section>
  );
}