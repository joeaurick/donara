import { HomepageCardProps } from "@/types/homepage";

export default function AboutCard({
  form,
  setForm,
}: HomepageCardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl text-amber-600">
          📖
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            About Section
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Ceritakan mengenai Donara kepada pelanggan agar brand terlihat lebih
            terpercaya, hangat, dan profesional.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-wide text-slate-700">
            About Title
          </label>

          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
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

        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-wide text-slate-700">
            About Description
          </label>

          <textarea
            rows={6}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
            placeholder="Tulis cerita singkat tentang Donara, kualitas bahan, proses pembuatan, dan pengalaman pelanggan yang ingin Anda tonjolkan."
            value={form.about_description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                about_description: e.target.value,
              }))
            }
          />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Deskripsi yang jelas membantu pelanggan lebih percaya.</span>

            <span>
              {form.about_description.length} karakter
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}