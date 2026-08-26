import { HomepageCardProps } from "@/types/homepage";
import {
  BookOpen,
  Heart,
  Lightbulb,
} from "lucide-react";

export default function AboutCard({
  form,
  setForm,
}: HomepageCardProps) {
  return (
    <div className="space-y-7">
      {/* INFO */}
      <div className="rounded-[22px] border border-orange-100 bg-orange-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-black text-orange-900">
              Ceritakan tentang brand Anda
            </p>

            <p className="mt-1 text-xs leading-5 text-orange-700">
              Bagian ini membantu pelanggan mengenal identitas,
              cerita, dan keunggulan bisnis Anda.
            </p>
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div className="space-y-3">
        <label className="text-sm font-black text-slate-800">
          About Title
        </label>

        <input
          className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          placeholder="Contoh: Donat Fresh Setiap Hari"
          value={form.about_title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              about_title: e.target.value,
            }))
          }
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-black text-slate-800">
            About Description
          </label>

          <span className="text-xs font-bold text-slate-400">
            {form.about_description.length} karakter
          </span>
        </div>

        <textarea
          rows={7}
          className="w-full resize-none rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          placeholder="Tulis cerita singkat tentang bisnis Anda, kualitas produk, proses pembuatan, dan pengalaman pelanggan yang ingin Anda tonjolkan."
          value={form.about_description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              about_description: e.target.value,
            }))
          }
        />

        <div className="flex items-start gap-3 rounded-[20px] border border-orange-100 bg-orange-50/70 p-4">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />

          <p className="text-xs leading-5 text-orange-700">
            Cerita yang autentik dan jelas dapat membantu pelanggan
            merasa lebih dekat serta meningkatkan kepercayaan terhadap
            brand Anda.
          </p>
        </div>
      </div>
    </div>
  );
}