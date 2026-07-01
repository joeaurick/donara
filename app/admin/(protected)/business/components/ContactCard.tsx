"use client";

import { BusinessForm } from "@/types/business";

type Props = {
  form: BusinessForm;
  setForm: React.Dispatch<
    React.SetStateAction<BusinessForm>
  >;
};

export default function ContactCard({
  form,
  setForm,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-8 text-3xl font-black text-pink-600">
        📞 Kontak & Media Sosial
      </h2>

      <div className="space-y-6">

        <div>
          <label className="mb-2 block font-bold">
            WhatsApp
          </label>

          <input
            className="w-full rounded-xl border p-4"
            placeholder="628xxxxxxxxxx"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-bold">
            Email
          </label>

          <input
            type="email"
            className="w-full rounded-xl border p-4"
            placeholder="donara.streetfood@gmail.com"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-bold">
            Instagram
          </label>

          <input
            className="w-full rounded-xl border p-4"
            placeholder="@donara.streetfood"
            value={form.instagram}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                instagram: e.target.value,
              }))
            }
          />
        </div>

      </div>

    </div>
  );
}