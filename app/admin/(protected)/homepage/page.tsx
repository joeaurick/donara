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
  hero_image_url: "",

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
      hero_image_url:
  data?.hero_image_url ?? "",

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
  <main className="min-h-screen bg-gradient-to-br from-[#FFF8F3] via-white to-pink-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 p-6 text-white shadow-2xl sm:p-8 lg:p-10">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-pink-50 backdrop-blur">
              <span>✨</span>
              <span>Landing Page Manager</span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Kelola Homepage Donara
            </h1>

            <p className="mt-4 text-sm leading-6 text-pink-50 sm:text-base">
              Kelola seluruh konten landing page Donara dengan tampilan yang
              lebih modern, responsif, dan profesional.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[320px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-wider text-pink-100">
                Hero
              </p>
              <p className="mt-2 text-2xl font-black">01</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-wider text-pink-100">
                About
              </p>
              <p className="mt-2 text-2xl font-black">02</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-wider text-pink-100">
                CTA
              </p>
              <p className="mt-2 text-2xl font-black">03</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-lg text-pink-600">
              🚀
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                Hero Section
              </h2>

              <p className="text-sm text-slate-500">
                Deskripsi utama yang tampil pertama kali pada landing page.
              </p>
            </div>
          </div>

          <HeroCard
            form={form}
            setForm={setForm}
          />
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-lg text-amber-600">
              🥯
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                About Section
              </h2>

              <p className="text-sm text-slate-500">
                Ceritakan identitas brand Donara dan keunggulan produk Anda.
              </p>
            </div>
          </div>

          <AboutCard
            form={form}
            setForm={setForm}
          />
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-lg text-emerald-600">
              💬
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                WhatsApp CTA
              </h2>

              <p className="text-sm text-slate-500">
                Atur pesan otomatis yang dikirim pelanggan saat menghubungi
                WhatsApp.
              </p>
            </div>
          </div>

          <CtaCard
            form={form}
            setForm={setForm}
          />
        </div>
      </div>

      {/* Save */}
      <div className="sticky bottom-4 z-10 mt-8 flex justify-end">
        <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur">
          <SaveButton
            loading={saving}
            onClick={saveHomepage}
            text="Simpan Homepage"
          />
        </div>
      </div>
    </div>
  </main>
);
}