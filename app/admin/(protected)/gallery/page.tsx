"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/app/components/ImageUpload";
import { supabase } from "@/lib/supabase/client";

type Gallery = {
  id: number;
  image: string;
};

export default function GalleryAdminPage() {
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("id");

      if (error) {
        alert(error.message);
        return;
      }

      setGallery(data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat gallery.");
    } finally {
      setLoading(false);
    }
  }

  async function saveImage() {
    if (!image.trim()) {
      alert("Upload gambar terlebih dahulu.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("gallery")
        .insert({
          image: image.trim(),
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Foto berhasil ditambahkan.");

      setImage("");
      await loadGallery();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteImage(id: number) {
    const ok = confirm("Yakin ingin menghapus foto ini?");

    if (!ok) return;

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadGallery();
  }

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <main className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black text-pink-600">
            Kelola Gallery
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Tambahkan dan kelola foto gallery Donara.
          </p>
        </div>

        <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600">
          {gallery.length} foto
        </div>
      </div>

      {/* Upload Card */}
      <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Tambah Foto Baru
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Upload foto terbaik untuk ditampilkan pada halaman gallery
              website Donara.
            </p>
          </div>

          <ImageUpload
            value={image}
            onChange={setImage}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveImage}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Tambah Foto"}
            </button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {gallery.length === 0 ? (
        <div className="rounded-3xl border border-pink-100 bg-white p-10 text-center text-gray-500 shadow-sm">
          Belum ada foto di gallery.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={item.image}
                alt="Gallery"
                className="h-56 w-full object-cover"
              />

              <div className="border-t border-pink-50 p-4">
                <button
                  type="button"
                  onClick={() => deleteImage(item.id)}
                  className="w-full rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Hapus Foto
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}