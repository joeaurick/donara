import { HomepageCardProps } from "@/types/homepage";

export default function HeroCard({
  form,
  setForm,
}: HomepageCardProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-2 text-3xl font-black text-pink-600">
        🎯 Hero Section
      </h2>

      <p className="mb-8 text-gray-500">
        Hero Heading (H1) dikelola dari menu SEO agar tidak terjadi
        duplikasi. Halaman Homepage hanya mengatur deskripsi Hero.
      </p>

      <div>

        <label className="mb-2 block text-lg font-bold">
          Hero Description
        </label>

        <textarea
          rows={5}
          className="w-full rounded-xl border p-4"
          value={form.hero_description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              hero_description: e.target.value,
            }))
          }
        />

      </div>

    </div>
  );
}