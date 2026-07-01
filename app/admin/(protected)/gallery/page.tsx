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
      <main className="p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="p-10">

      <h1 className="mb-10 text-4xl font-black text-pink-600">
        Kelola Gallery
      </h1>

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <ImageUpload
          value={image}
          onChange={setImage}
        />

        <button
          onClick={saveImage}
          disabled={saving}
          className="mt-6 rounded-full bg-pink-600 px-8 py-4 font-bold text-white disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Tambah Foto"}
        </button>

      </div>

      {gallery.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-xl text-gray-500">
          Belum ada foto di gallery.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:grid-cols-4">

          {gallery.map((item) => (

            <div
              key={item.id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg"
            >

              <img
                src={item.image}
                alt="Gallery"
                className="h-56 w-full object-cover"
              />

              <button
                onClick={() => deleteImage(item.id)}
                className="w-full bg-red-500 py-4 font-bold text-white hover:bg-red-600"
              >
                Hapus
              </button>

            </div>

          ))}

        </div>
      )}

    </main>
  );
}