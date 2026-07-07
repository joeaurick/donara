"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { HomepageForm } from "@/types/homepage";

import HeroCard from "./components/HeroCard";
import AboutCard from "./components/AboutCard";
import CtaCard from "./components/CtaCard";
import SaveButton from "@/app/components/admin/ui/SaveButton";
import toast from "react-hot-toast";

const initialForm: HomepageForm = {
  hero_description: "",

  about_title: "",
  about_description: "",

  cta_title: "",
  cta_description: "",

  whatsapp_message: "",
};

export default function HomepagePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] =
    useState<HomepageForm>(initialForm);

  useEffect(() => {
    loadHomepage();
  }, []);

  async function loadHomepage() {
    setLoading(true);

    const { data, error } = await supabase
      .from("homepage_content")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setForm({
      hero_description: data.hero_description ?? "",

      about_title: data.about_title ?? "",
      about_description: data.about_description ?? "",

      cta_title: data.cta_title ?? "",
      cta_description: data.cta_description ?? "",

      whatsapp_message: data.whatsapp_message ?? "",
    });

    setLoading(false);
  }

  async function saveHomepage() {
    setSaving(true);

    const { error } = await supabase
      .from("homepage_content")
      .update(form)
      .eq("id", 1);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Homepage berhasil disimpan.");
  }

  if (loading) {
    return (
      <main className="p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8F3] p-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-black text-pink-600">
            🏠 Homepage
          </h1>

          <p className="mt-2 text-gray-500">
            Kelola seluruh konten landing page Donara.
          </p>

        </div>

        {/* Hero */}

        <HeroCard
          form={form}
          setForm={setForm}
        />

        {/* About */}

        <div className="mt-8">

          <AboutCard
            form={form}
            setForm={setForm}
          />

        </div>

        {/* CTA */}

        <div className="mt-8">

          <CtaCard
            form={form}
            setForm={setForm}
          />

        </div>

        {/* Save */}

        <SaveButton
  loading={saving}
  onClick={saveHomepage}
  text="Simpan Homepage"
/>

      </div>

    </main>
  );
}