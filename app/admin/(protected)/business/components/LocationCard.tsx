"use client";

import { BusinessForm } from "@/types/business";

type Props = {
  form: BusinessForm;
  setForm: React.Dispatch<React.SetStateAction<BusinessForm>>;
};

export default function LocationCard({
  form,
  setForm,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-8 text-3xl font-black text-pink-600">
        📍 Lokasi Bisnis
      </h2>

      <div className="space-y-6">

        <div>

          <label className="mb-2 block font-bold">
            Google Maps URL
          </label>

          <input
            className="w-full rounded-xl border p-4"
            placeholder="https://maps.google.com/..."
            value={form.maps_url}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                maps_url: e.target.value,
              }))
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-bold">
            Google Maps Embed URL
          </label>

          <textarea
            rows={5}
            className="w-full rounded-xl border p-4"
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={form.maps_embed}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                maps_embed: e.target.value,
              }))
            }
          />

        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-bold">
              Latitude
            </label>

            <input
              className="w-full rounded-xl border p-4"
              placeholder="-6.22"
              value={form.latitude}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  latitude: e.target.value,
                }))
              }
            />

          </div>

          <div>

            <label className="mb-2 block font-bold">
              Longitude
            </label>

            <input
              className="w-full rounded-xl border p-4"
              placeholder="106.95"
              value={form.longitude}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  longitude: e.target.value,
                }))
              }
            />

          </div>

        </div>

      </div>

    </div>
  );
}