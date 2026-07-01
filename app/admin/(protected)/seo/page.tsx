"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import ImageUpload from "@/app/components/ImageUpload";
import GeneralSeoCard from "./components/GeneralSeoCard";
import SeoScore from "./components/SeoScore";
import SeoPreview from "./components/SeoPreview";
import SaveButton from "@/app/components/admin/ui/SaveButton";
import toast from "react-hot-toast";

export default function SeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    site_title: "",
    homepage_h1: "",
    meta_description: "",
    keywords: "",
    focus_keyword: "",
    canonical_url: "",
    robots: "index,follow",

    og_image: "",
    favicon: "",

    google_analytics: "",
    google_verification: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setForm({
      site_title: data.site_title ?? "",
      homepage_h1: data.homepage_h1 ?? "",
      meta_description: data.meta_description ?? "",
      keywords: data.keywords ?? "",
      focus_keyword: data.focus_keyword ?? "",
      canonical_url: data.canonical_url ?? "",
      robots: data.robots ?? "index,follow",

      og_image: data.og_image ?? "",
      favicon: data.favicon ?? "",

      google_analytics: data.google_analytics ?? "",
      google_verification: data.google_verification ?? "",
    });

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);

    const { error } = await supabase
      .from("settings")
      .update(form)
      .eq("id", 1);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("SEO berhasil disimpan.");
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

      <div className="mx-auto max-w-7xl">

        <div className="mb-10">

          <h1 className="text-5xl font-black text-pink-600">
            🌐 SEO Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Kelola seluruh SEO website Donara dari dashboard admin.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ================= LEFT ================= */}

          <div className="space-y-8 lg:col-span-2">

            <GeneralSeoCard
              form={form}
              setForm={setForm}
            />

            <div className="rounded-3xl bg-white p-8 shadow-xl">

              <h2 className="mb-6 text-3xl font-black text-pink-600">
                📱 Social Media
              </h2>

              <div className="space-y-8">

                <div>

                  <label className="mb-3 block font-bold">
                    Open Graph Image
                  </label>

                  <ImageUpload
                    value={form.og_image}
                    onChange={(url)=>
                      setForm(prev=>({
                        ...prev,
                        og_image:url
                      }))
                    }
                  />

                </div>

                <div>

                  <label className="mb-3 block font-bold">
                    Favicon
                  </label>

                  <ImageUpload
                    value={form.favicon}
                    onChange={(url)=>
                      setForm(prev=>({
                        ...prev,
                        favicon:url
                      }))
                    }
                  />

                </div>

              </div>

            </div>

            <div className="rounded-3xl bg-white p-8 shadow-xl">

              <h2 className="mb-6 text-3xl font-black text-pink-600">
                📈 Google
              </h2>

              <div className="space-y-6">

                <div>

                  <label className="mb-2 block font-bold">
                    Google Analytics
                  </label>

                  <input
                    className="w-full rounded-xl border p-4"
                    placeholder="G-XXXXXXXXXX"
                    value={form.google_analytics}
                    onChange={(e)=>
                      setForm(prev=>({
                        ...prev,
                        google_analytics:e.target.value
                      }))
                    }
                  />

                </div>

                <div>

                  <label className="mb-2 block font-bold">
                    Google Search Console
                  </label>

                  <input
                    className="w-full rounded-xl border p-4"
                    placeholder="google-site-verification=..."
                    value={form.google_verification}
                    onChange={(e)=>
                      setForm(prev=>({
                        ...prev,
                        google_verification:e.target.value
                      }))
                    }
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="space-y-8">

            <SeoScore
              title={form.site_title}
              description={form.meta_description}
              keywords={form.keywords}
              ogImage={form.og_image}
              favicon={form.favicon}
              analytics={form.google_analytics}
            />

            <SeoPreview
            title={form.site_title}
            description={form.meta_description}
            favicon={form.favicon}
            canonicalUrl={form.canonical_url}
            />

          </div>

        </div>

        <SaveButton
        loading={saving}
        onClick={saveSettings}
        text="Simpan SEO"
        />

      </div>

    </main>
  );
}