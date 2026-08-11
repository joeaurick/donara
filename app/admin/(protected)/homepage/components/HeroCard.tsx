import { HomepageCardProps } from "@/types/homepage";
import { supabase } from "@/lib/supabase/client";

export default function HeroCard({
  form,
  setForm,
}: HomepageCardProps) {
  async function handleImageUpload(
    file: File
  ) {
    try {
      const ext =
        file.name.split(".").pop() || "jpg";

      const fileName = `hero-${Date.now()}.${ext}`;

      // Upload ke Supabase Storage
      const { error } =
        await supabase.storage
          .from("homepage-assets")
          .upload(fileName, file, {
            upsert: true,
          });

      if (error) {
        alert(error.message);
        return;
      }

      // Ambil public URL
      const { data } = supabase.storage
        .from("homepage-assets")
        .getPublicUrl(fileName);

      // Simpan ke form state
      setForm((prev) => ({
        ...prev,
        hero_image_url: data.publicUrl,
      }));
    } catch (err) {
      console.error(err);

      alert(
        "Gagal upload gambar hero"
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-xl text-pink-600">
          🎯
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Hero Section
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Hero Heading (H1) dikelola dari menu SEO agar tidak terjadi
            duplikasi. Halaman Homepage hanya mengatur deskripsi Hero dan gambar
            utama landing page.
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-black uppercase tracking-wide text-slate-700">
            Hero Image
          </label>

          <span className="rounded-full bg-pink-50 px-2 py-1 text-[11px] font-black text-pink-600">
            HERO IMAGE
          </span>
        </div>

        {form.hero_image_url && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <img
              src={form.hero_image_url}
              alt="Hero Preview"
              className="h-56 w-full object-cover sm:h-72"
            />
          </div>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all duration-200 hover:border-pink-400 hover:bg-pink-50">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            🖼️
          </div>

          <span className="mt-3 text-sm font-black text-slate-700">
            Upload Gambar Hero
          </span>

          <span className="mt-1 text-xs text-slate-500">
            JPG, PNG, atau WEBP (disarankan 1600×900)
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (file) {
                handleImageUpload(file);
              }
            }}
          />
        </label>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          <div className="flex items-start gap-2">
            <span className="text-sm">💡</span>

            <p className="leading-5">
              Gambar ini akan digunakan sebagai banner utama pada landing page
              Donara. Gunakan foto dengan kualitas terang dan fokus pada produk.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-black uppercase tracking-wide text-slate-700">
            Hero Description
          </label>

          <span className="rounded-full bg-pink-50 px-2 py-1 text-[11px] font-black text-pink-600">
            HERO COPY
          </span>
        </div>

        <textarea
          rows={6}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          placeholder="Contoh: Donara menghadirkan donat fresh setiap hari dengan tekstur lembut, topping premium, dan rasa yang selalu membuat pelanggan ingin kembali lagi."
          value={form.hero_description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              hero_description: e.target.value,
            }))
          }
        />

        <div className="flex flex-col gap-2 rounded-2xl border border-pink-100 bg-pink-50 p-4 text-xs text-pink-700 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2">
            <span className="text-sm">💡</span>

            <p className="leading-5">
              Gunakan 1–2 kalimat singkat yang menjelaskan keunggulan utama
              Donara dan mendorong pelanggan untuk melakukan pemesanan.
            </p>
          </div>

          <span className="font-black text-pink-800">
            {form.hero_description.length} karakter
          </span>
        </div>
      </div>
    </div>
  );
}