"use client";

import { Store, Sparkles, MapPin, Clock3, Wallet } from "lucide-react";
import { BusinessForm } from "@/types/business";

type Props = {
  form: BusinessForm;
  setForm: React.Dispatch<React.SetStateAction<BusinessForm>>;
};

export default function BusinessInfoCard({
  form,
  setForm,
}: Props) {
  return (
    <div className="rounded-3xl border border-pink-100 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-pink-50 bg-gradient-to-r from-pink-50/70 to-orange-50/40 px-6 py-5 md:px-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20">
            <Store className="h-5 w-5" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-600 ring-1 ring-pink-100">
              <Sparkles className="h-3.5 w-3.5" />
              Business Profile
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
              Informasi Bisnis
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Lengkapi profil bisnis Donara yang akan ditampilkan di website,
              SEO, dan halaman kontak pelanggan.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 p-6 md:p-8">
        {/* Nama Bisnis */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Store className="h-4 w-4 text-pink-500" />
            Nama Bisnis
          </label>

          <input
            className="h-12 w-full rounded-2xl border border-pink-100 bg-pink-50/30 px-4 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            value={form.business_name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                business_name: e.target.value,
              }))
            }
          />
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Sparkles className="h-4 w-4 text-pink-500" />
            Tagline
          </label>

          <input
            className="h-12 w-full rounded-2xl border border-pink-100 bg-pink-50/30 px-4 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            placeholder="Fresh Every Day"
            value={form.tagline}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                tagline: e.target.value,
              }))
            }
          />
        </div>

        {/* Alamat */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="h-4 w-4 text-pink-500" />
            Alamat Lengkap
          </label>

          <textarea
            className="min-h-[120px] w-full rounded-2xl border border-pink-100 bg-pink-50/30 px-4 py-3 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            value={form.address}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
        </div>

        {/* Jam Operasional */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Clock3 className="h-4 w-4 text-pink-500" />
            Jam Operasional
          </label>

          <input
            className="h-12 w-full rounded-2xl border border-pink-100 bg-pink-50/30 px-4 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            placeholder="Senin - Minggu, 08.00 - 22.00"
            value={form.opening_hours}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                opening_hours: e.target.value,
              }))
            }
          />
        </div>

        {/* Range Harga */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Wallet className="h-4 w-4 text-pink-500" />
            Range Harga
          </label>

          <input
            className="h-12 w-full rounded-2xl border border-pink-100 bg-pink-50/30 px-4 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100"
            placeholder="Rp10.000 - Rp50.000"
            value={form.price_range}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                price_range: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}