"use client";

import { BusinessForm } from "@/types/business";

type Props = {
  form: BusinessForm;
  setForm: React.Dispatch<
    React.SetStateAction<BusinessForm>
  >;
};

export default function BusinessInfoCard({
  form,
  setForm,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-8 text-3xl font-black text-pink-600">
        🏪 Informasi Bisnis
      </h2>

      <div className="space-y-6">

        <div>
          <label className="mb-2 block font-bold">
            Nama Bisnis
          </label>

          <input
            className="w-full rounded-xl border p-4"
            value={form.business_name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                business_name: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-bold">
            Tagline
          </label>

          <input
            className="w-full rounded-xl border p-4"
            placeholder="Fresh Every Day"
            value={form.tagline}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                tagline: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-bold">
            Alamat Lengkap
          </label>

          <textarea
            className="h-36 w-full rounded-xl border p-4"
            value={form.address}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-bold">
            Jam Operasional
          </label>

          <input
            className="w-full rounded-xl border p-4"
            value={form.opening_hours}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                opening_hours: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-bold">
            Range Harga
          </label>

          <input
            className="w-full rounded-xl border p-4"
            placeholder="Rp10.000 - Rp50.000"
            value={form.price_range}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                price_range: e.target.value,
              }))
            }
          />
        </div>

      </div>

    </div>
  );
}