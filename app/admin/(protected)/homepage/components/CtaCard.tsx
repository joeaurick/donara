import { HomepageCardProps } from "@/types/homepage";

export default function CtaCard({
  form,
  setForm,
}: HomepageCardProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-2 text-3xl font-black text-pink-600">
        📣 Call To Action
      </h2>

      <p className="mb-8 text-gray-500">
        Atur ajakan pembelian melalui WhatsApp.
      </p>

      <div className="space-y-6">

        <div>

          <label className="mb-2 block text-lg font-bold">
            CTA Title
          </label>

          <input
            className="w-full rounded-xl border p-4"
            value={form.cta_title}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                cta_title:e.target.value,
              }))
            }
          />

        </div>

        <div>

          <label className="mb-2 block text-lg font-bold">
            CTA Description
          </label>

          <textarea
            rows={5}
            className="w-full rounded-xl border p-4"
            value={form.cta_description}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                cta_description:e.target.value,
              }))
            }
          />

        </div>

        <div>

          <label className="mb-2 block text-lg font-bold">
            WhatsApp Message
          </label>

          <textarea
            rows={4}
            className="w-full rounded-xl border p-4"
            value={form.whatsapp_message}
            onChange={(e)=>
              setForm(prev=>({
                ...prev,
                whatsapp_message:e.target.value,
              }))
            }
          />

        </div>

      </div>

    </div>
  );
}