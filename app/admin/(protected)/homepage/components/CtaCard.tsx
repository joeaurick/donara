import { HomepageCardProps } from "@/types/homepage";

export default function CtaCard({
  form,
  setForm,
}: HomepageCardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl text-emerald-600">
          📣
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Call To Action
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Atur ajakan pembelian dan pesan otomatis WhatsApp yang akan diterima
            pelanggan saat menghubungi Donara.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6">
        {/* CTA Title */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-wide text-slate-700">
            CTA Title
          </label>

          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
            placeholder="Contoh: Pesan Donat Sekarang"
            value={form.cta_title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                cta_title: e.target.value,
              }))
            }
          />
        </div>

        {/* CTA Description */}
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-wide text-slate-700">
            CTA Description
          </label>

          <textarea
            rows={5}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
            placeholder="Contoh: Hubungi kami sekarang untuk memesan donat fresh dengan berbagai varian favorit Anda."
            value={form.cta_description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                cta_description: e.target.value,
              }))
            }
          />
        </div>

        {/* WhatsApp Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-black uppercase tracking-wide text-slate-700">
              WhatsApp Message
            </label>

            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-600">
              WA AUTO REPLY
            </span>
          </div>

          <textarea
            rows={6}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
            placeholder="Halo Donara 👋
Saya ingin memesan donat hari ini. Mohon info menu dan stok yang tersedia ya 😊"
            value={form.whatsapp_message}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                whatsapp_message: e.target.value,
              }))
            }
          />

          <div className="flex flex-col gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-700 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-2">
              <span className="text-sm">💡</span>

              <p className="leading-5">
                Pesan ini akan otomatis terisi saat pelanggan menekan tombol
                WhatsApp di landing page.
              </p>
            </div>

            <span className="font-black text-emerald-800">
              {form.whatsapp_message.length} karakter
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}