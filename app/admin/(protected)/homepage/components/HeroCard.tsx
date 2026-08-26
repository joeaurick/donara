import { HomepageCardProps } from "@/types/homepage";
import { supabase } from "@/lib/supabase/client";
import {
  ImagePlus,
  ImageIcon,
  Lightbulb,
  Upload,
} from "lucide-react";

export default function HeroCard({
  form,
  setForm,
}: HomepageCardProps) {
  async function handleImageUpload(file: File) {
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `hero-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("homepage-assets")
        .upload(fileName, file, {
          upsert: true,
        });

      if (error) {
        alert(error.message);
        return;
      }

      const { data } = supabase.storage
        .from("homepage-assets")
        .getPublicUrl(fileName);

      setForm((prev) => ({
        ...prev,
        hero_image_url: data.publicUrl,
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal upload gambar hero");
    }
  }

  return (
    <div className="space-y-7">
      {/* INFO */}
      <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/60 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <ImageIcon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-black text-emerald-900">
              Konten utama website
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Atur gambar utama dan deskripsi yang pertama kali
              dilihat oleh pengunjung.
            </p>
          </div>
        </div>
      </div>

      {/* HERO IMAGE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-black text-slate-800">
            Hero Image
          </label>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
            Homepage Banner
          </span>
        </div>

        {form.hero_image_url ? (
          <div className="overflow-hidden rounded-[24px] border border-emerald-100 bg-slate-50">
            <img
              src={form.hero_image_url}
              alt="Hero Preview"
              className="h-56 w-full object-cover sm:h-72"
            />
          </div>
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-dashed border-emerald-200 bg-emerald-50/30 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-sm">
              <ImagePlus className="h-6 w-6" />
            </div>

            <p className="mt-4 text-sm font-black text-slate-700">
              Belum ada gambar hero
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Upload gambar untuk menampilkan preview.
            </p>
          </div>
        )}

        <label className="group flex cursor-pointer items-center gap-4 rounded-[22px] border border-dashed border-emerald-200 bg-emerald-50/40 p-4 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Upload className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-black text-slate-800">
              Upload Gambar Hero
            </p>

            <p className="mt-1 text-xs text-slate-400">
              JPG, PNG, WEBP · Disarankan 1600 × 900
            </p>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                handleImageUpload(file);
              }
            }}
          />
        </label>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-black text-slate-800">
            Hero Description
          </label>

          <span className="text-xs font-bold text-slate-400">
            {form.hero_description.length} karakter
          </span>
        </div>

        <textarea
          rows={6}
          className="w-full resize-none rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          placeholder="Contoh: Donara menghadirkan donat fresh setiap hari dengan tekstur lembut, topping premium, dan rasa yang selalu membuat pelanggan ingin kembali lagi."
          value={form.hero_description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              hero_description: e.target.value,
            }))
          }
        />

        <div className="flex items-start gap-3 rounded-[20px] border border-emerald-100 bg-emerald-50/70 p-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

          <p className="text-xs leading-5 text-emerald-700">
            Gunakan deskripsi singkat yang menjelaskan keunggulan
            utama bisnis Anda dan mendorong pelanggan untuk melakukan
            pembelian.
          </p>
        </div>
      </div>
    </div>
  );
}