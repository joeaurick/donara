import { HomepageCardProps } from "@/types/homepage";
import {
  Lightbulb,
  MessageCircle,
  Send,
} from "lucide-react";

export default function CtaCard({
  form,
  setForm,
}: HomepageCardProps) {
  return (
    <div className="space-y-7">
      {/* INFO */}
      <div className="rounded-[22px] border border-pink-100 bg-pink-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-pink-500 shadow-sm">
            <MessageCircle className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-black text-pink-900">
              Dorong pelanggan untuk menghubungi Anda
            </p>

            <p className="mt-1 text-xs leading-5 text-pink-700">
              Atur ajakan pembelian dan pesan WhatsApp yang akan
              otomatis terisi saat pelanggan menghubungi bisnis Anda.
            </p>
          </div>
        </div>
      </div>

      {/* CTA TITLE */}
      <div className="space-y-3">
        <label className="text-sm font-black text-slate-800">
          CTA Title
        </label>

        <input
          className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          placeholder="Contoh: Pesan Sekarang"
          value={form.cta_title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              cta_title: e.target.value,
            }))
          }
        />
      </div>

      {/* CTA DESCRIPTION */}
      <div className="space-y-3">
        <label className="text-sm font-black text-slate-800">
          CTA Description
        </label>

        <textarea
          rows={5}
          className="w-full resize-none rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          placeholder="Contoh: Hubungi kami sekarang untuk memesan produk favorit Anda."
          value={form.cta_description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              cta_description: e.target.value,
            }))
          }
        />
      </div>

      {/* WHATSAPP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-black text-slate-800">
            WhatsApp Message
          </label>

          <span className="rounded-full bg-pink-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-pink-600">
            Auto Message
          </span>
        </div>

        <textarea
          rows={7}
          className="w-full resize-none rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          placeholder={`Halo 👋
Saya ingin mengetahui informasi produk yang tersedia hari ini.`}
          value={form.whatsapp_message}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              whatsapp_message: e.target.value,
            }))
          }
        />

        <div className="flex flex-col gap-3 rounded-[20px] border border-pink-100 bg-pink-50/70 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Send className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />

            <p className="text-xs leading-5 text-pink-700">
              Pesan ini akan otomatis terisi ketika pelanggan menekan
              tombol WhatsApp pada website Anda.
            </p>
          </div>

          <span className="shrink-0 text-xs font-black text-pink-600">
            {form.whatsapp_message.length} karakter
          </span>
        </div>
      </div>
    </div>
  );
}