"use client";

import { useEffect, useState } from "react";
import {
  ImageIcon,
  Info,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase/client";
import { HomepageForm } from "@/types/homepage";

import HeroCard from "./components/HeroCard";
import AboutCard from "./components/AboutCard";
import CtaCard from "./components/CtaCard";
import SaveHomepageButton from "./components/SaveHomepageButton";

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
      hero_description:
        data?.hero_description ?? "",

      hero_image_url:
        data?.hero_image_url ?? "",

      about_title:
        data?.about_title ?? "",

      about_description:
        data?.about_description ?? "",

      cta_title:
        data?.cta_title ?? "",

      cta_description:
        data?.cta_description ?? "",

      whatsapp_message:
        data?.whatsapp_message ?? "",
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

    toast.success(
      "Homepage berhasil disimpan."
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf9] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-64 rounded-[32px] bg-emerald-50" />

          <div className="mt-6 space-y-6">
            <div className="h-80 rounded-[30px] bg-white" />
            <div className="h-80 rounded-[30px] bg-white" />
            <div className="h-80 rounded-[30px] bg-white" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER HOMEPAGE - WARNA MENU HOMEPAGE */}
        <section className="relative overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-br from-[#ecfdf7] via-[#f7fffc] to-[#d9f8ef] p-6 shadow-[0_16px_45px_rgba(16,185,129,0.08)] sm:p-8 lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="absolute -bottom-20 left-[30%] h-52 w-52 rounded-full bg-teal-200/20 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />

              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                Homepage Manager
              </span>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-xl">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Kelola Homepage
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  Atur seluruh konten yang tampil pada halaman utama
                  website agar tetap menarik, informatif, dan sesuai
                  dengan identitas brand Anda.
                </p>
              </div>

              {/* SECTION INDICATOR */}
              <div className="grid grid-cols-3 gap-3">
                <div className="min-w-[90px] rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50">
                    <ImageIcon className="h-4 w-4 text-emerald-600" />
                  </div>

                  <p className="mt-3 text-xl font-black text-slate-900">
                    01
                  </p>

                  <p className="text-[10px] font-bold text-slate-400">
                    Hero
                  </p>
                </div>

                <div className="min-w-[90px] rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50">
                    <Info className="h-4 w-4 text-orange-500" />
                  </div>

                  <p className="mt-3 text-xl font-black text-slate-900">
                    02
                  </p>

                  <p className="text-[10px] font-bold text-slate-400">
                    About
                  </p>
                </div>

                <div className="min-w-[90px] rounded-2xl border border-pink-100 bg-white/90 p-4 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-50">
                    <MessageCircle className="h-4 w-4 text-pink-500" />
                  </div>

                  <p className="mt-3 text-xl font-black text-slate-900">
                    03
                  </p>

                  <p className="text-[10px] font-bold text-slate-400">
                    CTA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 space-y-6">

          {/* HERO - EMERALD */}
          <section className="relative overflow-hidden rounded-[30px] border border-emerald-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-emerald-500" />

            <div className="flex flex-col gap-4 border-b border-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
                  <ImageIcon className="h-6 w-6 text-emerald-600" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                    Hero Section
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Konten utama yang pertama kali dilihat pengunjung.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                Section 01
              </span>
            </div>

            <div className="p-4 sm:p-7">
              <HeroCard
                form={form}
                setForm={setForm}
              />
            </div>
          </section>

          {/* ABOUT - ORANGE */}
          <section className="relative overflow-hidden rounded-[30px] border border-orange-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-orange-400" />

            <div className="flex flex-col gap-4 border-b border-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                  <Info className="h-6 w-6 text-orange-500" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                    About Section
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Ceritakan identitas, cerita, dan keunggulan brand.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-orange-600">
                Section 02
              </span>
            </div>

            <div className="p-4 sm:p-7">
              <AboutCard
                form={form}
                setForm={setForm}
              />
            </div>
          </section>

          {/* CTA - PINK */}
          <section className="relative overflow-hidden rounded-[30px] border border-pink-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-pink-500" />

            <div className="flex flex-col gap-4 border-b border-pink-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50">
                  <MessageCircle className="h-6 w-6 text-pink-500" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                    WhatsApp CTA
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Atur ajakan dan pesan otomatis pelanggan.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-pink-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-pink-600">
                Section 03
              </span>
            </div>

            <div className="p-4 sm:p-7">
              <CtaCard
                form={form}
                setForm={setForm}
              />
            </div>
          </section>
        </div>

        {/* SAVE */}
        <SaveHomepageButton
          saving={saving}
          onSave={saveHomepage}
        />
      </div>
    </main>
  );
}