"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import { BusinessForm } from "@/types/business";

import ImageUpload from "@/app/components/ImageUpload";

import BusinessInfoCard from "./components/BusinessInfoCard";
import BusinessPreview from "./components/BusinessPreview";
import BusinessScore from "./components/BusinessScore";
import ContactCard from "./components/ContactCard";
import LocationCard from "./components/LocationCard";
import SaveButton from "@/app/components/admin/ui/SaveButton";
import toast from "react-hot-toast";

const initialForm: BusinessForm = {
  business_name: "",
  tagline: "",

  address: "",

  phone: "",
  email: "",
  instagram: "",

  opening_hours: "",

  maps_url: "",
  maps_embed: "",

  latitude: "",
  longitude: "",

  price_range: "",

  logo: "",
};

export default function BusinessPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] =
    useState<BusinessForm>(initialForm);

  useEffect(() => {
    loadBusiness();
  }, []);

  async function loadBusiness() {
    setLoading(true);

    const { data, error } = await supabase
      .from("business_profile")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setForm({
    business_name: data.business_name ?? "",
    tagline: data.tagline ?? "",

    address: data.address ?? "",

      phone: data.phone ?? "",
      email: data.email ?? "",
      instagram: data.instagram ?? "",

      opening_hours: data.opening_hours ?? "",

      maps_url: data.maps_url ?? "",
      maps_embed: data.maps_embed ?? "",

      latitude:
  data.latitude != null
    ? String(data.latitude)
    : "",

    longitude:
  data.longitude != null
    ? String(data.longitude)
    : "",

      price_range: data.price_range ?? "",

      logo: data.logo ?? "",
    });

    setLoading(false);
  }

  async function saveBusiness() {
  setSaving(true);

  const payload = {
    ...form,

    latitude:
      form.latitude.trim() === ""
        ? null
        : parseFloat(form.latitude),

    longitude:
      form.longitude.trim() === ""
        ? null
        : parseFloat(form.longitude),
  };

  const { error } = await supabase
    .from("business_profile")
    .update(payload)
    .eq("id", 1);

  setSaving(false);

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  toast.success("Business berhasil disimpan.");
}

  if (loading) {
    return (
      <main className="p-10">
        Loading...
      </main>
    );
  }

  return (
  <main className="space-y-8">
    {/* Header */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">
          DONARA CMS
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Business Dashboard
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
          Kelola seluruh identitas bisnis Donara dari satu tempat dengan
          tampilan yang modern dan profesional.
        </p>
      </div>

      <SaveButton
        loading={saving}
        onClick={saveBusiness}
        text="Simpan Perubahan"
      />
    </div>

    {/* GRID UTAMA */}
    <div className="space-y-8">
  <BusinessInfoCard
    form={form}
    setForm={setForm}
  />

  <ContactCard
    form={form}
    setForm={setForm}
  />

  <LocationCard
    form={form}
    setForm={setForm}
  />

  <div className="rounded-3xl border border-pink-100 bg-white shadow-sm">
    <div className="border-b border-pink-50 px-6 py-5">
      <h2 className="text-2xl font-black text-slate-900">
        Logo Bisnis
      </h2>
    </div>

    <div className="p-6 md:p-8">
      <ImageUpload
        value={form.logo}
        onChange={(url) =>
          setForm((prev) => ({
            ...prev,
            logo: url,
          }))
        }
      />
    </div>
  </div>

  <BusinessScore
    businessName={form.business_name}
    address={form.address}
    phone={form.phone}
    email={form.email}
    instagram={form.instagram}
    openingHours={form.opening_hours}
    mapsUrl={form.maps_url}
    mapsEmbed={form.maps_embed}
    logo={form.logo}
    tagline={form.tagline}
  />

  <BusinessPreview
    businessName={form.business_name}
    address={form.address}
    phone={form.phone}
    email={form.email}
    instagram={form.instagram}
    openingHours={form.opening_hours}
    tagline={form.tagline}
    logo={form.logo}
  />
</div>
  </main>
);
}