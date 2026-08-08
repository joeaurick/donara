"use client";

import { Phone, Mail, Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { BusinessForm } from "@/types/business";

type Props = {
  form: BusinessForm;
  setForm: React.Dispatch<React.SetStateAction<BusinessForm>>;
};

export default function ContactCard({
  form,
  setForm,
}: Props) {
  return (
    <div className="rounded-3xl border border-pink-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-pink-50 bg-gradient-to-r from-pink-50/70 to-orange-50/40 px-6 py-5 md:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20">
            <Phone className="h-5 w-5" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-600 ring-1 ring-pink-100">
              <Sparkles className="h-3.5 w-3.5" />
              Contact & Social
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
              Kontak & Media Sosial
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Informasi ini akan digunakan untuk tombol WhatsApp, halaman
              kontak, dan profil bisnis Donara.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 p-6 md:p-8">
        {/* WhatsApp */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Phone className="h-4 w-4 text-pink-500" />
            WhatsApp
          </label>

          <input
            className="h-12 w-full rounded-2xl border border-pink-100 bg-pink-50/30 px-4 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            placeholder="6281234567890"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />

          <p className="text-xs text-slate-500">
            Gunakan format internasional tanpa tanda + atau spasi.
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mail className="h-4 w-4 text-pink-500" />
            Email
          </label>

          <input
            type="email"
            className="h-12 w-full rounded-2xl border border-pink-100 bg-pink-50/30 px-4 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            placeholder="donara.streetfood@gmail.com"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>

        {/* Instagram */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
           <FaInstagram className="h-4 w-4 text-pink-500" />
            Instagram
          </label>

          <input
            className="h-12 w-full rounded-2xl border border-pink-100 bg-pink-50/30 px-4 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            placeholder="@donara.streetfood"
            value={form.instagram}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                instagram: e.target.value,
              }))
            }
          />

          <p className="text-xs text-slate-500">
            Bisa menggunakan format @username atau username saja.
          </p>
        </div>
      </div>
    </div>
  );
}