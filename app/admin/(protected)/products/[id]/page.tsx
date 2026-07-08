"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ImageUpload from "@/app/components/ImageUpload";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
  name: "",
  price: "",
  image: "",
  rating: 5,
  description: "",
  category: "normal",
  track_stock: true,
});

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", Number(params.id))
        .maybeSingle();

      if (error) {
        alert(error.message);
        return;
      }

      if (data) {
        setForm({
  name: data.name,
  price: String(data.price),
  image: data.image,
  rating: data.rating,
  description: data.description,
  category: data.category ?? "normal",
  track_stock: data.track_stock ?? true,
});
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data produk.");
    } finally {
      setLoading(false);
    }
  }

  async function updateProduct() {
    if (
      !form.name.trim() ||
      !form.price ||
      !form.image.trim() ||
      !form.description.trim()
    ) {
      alert("Semua data wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("products")
        .update({
  name: form.name.trim(),
  price: Number(form.price),
  image: form.image.trim(),
  rating: form.rating,
  description: form.description.trim(),
  category: form.category,
  track_stock: form.track_stock,
})
        .eq("id", Number(params.id));

      if (error) {
        alert(error.message);
        return;
      }

      alert("Produk berhasil diperbarui.");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
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
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="mb-8 text-4xl font-black text-pink-600">
          Edit Produk
        </h1>

        <div className="space-y-6">

          <input
            className="w-full rounded-xl border p-4"
            placeholder="Nama Produk"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded-xl border p-4"
            type="number"
            placeholder="Harga"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
          />

          <ImageUpload
            value={form.image}
            onChange={(url) =>
              setForm({
                ...form,
                image: url,
              })
            }
          />

          <select
            className="w-full rounded-xl border p-4"
            value={form.rating}
            onChange={(e) =>
              setForm({
                ...form,
                rating: Number(e.target.value),
              })
            }
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>

          <select
  className="w-full rounded-xl border p-4"
  value={form.category}
  onChange={(e) =>
    setForm({
      ...form,
      category: e.target.value,
    })
  }
>
  <option value="normal">
    Normal
  </option>

  <option value="hemat">
    Hemat
  </option>
</select>

<div className="rounded-xl border p-4">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={form.track_stock}
      onChange={(e) =>
        setForm({
          ...form,
          track_stock: e.target.checked,
        })
      }
      className="h-5 w-5"
    />

    <div>
      <p className="font-bold">
        Kurangi stok harian
      </p>

      <p className="text-sm text-gray-500">
        Aktifkan untuk produk donat.
        Nonaktifkan untuk kopi, minuman, snack, dll.
      </p>
    </div>
  </label>
</div>

          <textarea
            className="h-40 w-full rounded-xl border p-4"
            placeholder="Deskripsi Produk"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() => router.back()}
              className="w-1/2 rounded-full border py-4 font-semibold"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={updateProduct}
              disabled={saving}
              className="w-1/2 rounded-full bg-pink-600 py-4 font-bold text-white disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}