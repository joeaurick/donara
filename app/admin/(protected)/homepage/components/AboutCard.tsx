import { HomepageCardProps } from "@/types/homepage";

export default function AboutCard({
  form,
  setForm,
}: HomepageCardProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-2 text-3xl font-black text-pink-600">
        📖 About Section
      </h2>

      <p className="mb-8 text-gray-500">
        Ceritakan mengenai Donara kepada pelanggan.
      </p>

      <div className="space-y-6">

        <div>

          <label className="mb-2 block text-lg font-bold">
            About Title
          </label>

          <input
            className="w-full rounded-xl border p-4"
            value={form.about_title}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                about_title:e.target.value,
              }))
            }
          />

        </div>

        <div>

          <label className="mb-2 block text-lg font-bold">
            About Description
          </label>

          <textarea
            rows={5}
            className="w-full rounded-xl border p-4"
            value={form.about_description}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                about_description:e.target.value,
              }))
            }
          />

        </div>

      </div>

    </div>
  );
}