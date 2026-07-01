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
      .single();

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
    <main className="mx-auto max-w-7xl">

  <div className="mb-10">

    <h1 className="text-5xl font-black text-pink-600">
      🏢 Business Dashboard
    </h1>

    <p className="mt-2 text-gray-500">
      Kelola seluruh identitas bisnis Donara dari satu tempat.
    </p>

  </div>

  <div className="grid gap-8 lg:grid-cols-3">

    {/* Kiri */}

    <div className="space-y-8 lg:col-span-2">

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


      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <h2 className="mb-6 text-3xl font-black text-pink-600">
          🖼 Logo Bisnis
        </h2>

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

    {/* Kanan */}

    <div className="space-y-8">

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

  </div>

  <SaveButton
  loading={saving}
  onClick={saveBusiness}
  text="Simpan Business"
/>

</main>
  );
}