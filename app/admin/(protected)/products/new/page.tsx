"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ImageUpload from "../../../../components/ImageUpload";

export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
  name: "",
  price: "",
  image: "",
  rating: 5,
  description: "",
  category: "normal",
  track_stock: true,
});

  async function saveProduct() {
    if (
      !form.name ||
      !form.price ||
      !form.image ||
      !form.description
    ) {
      alert("Semua data wajib diisi.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("products")
      .insert({
  name: form.name,
  price: Number(form.price),
  image: form.image,
  rating: form.rating,
  description: form.description,
  category: form.category,
  track_stock: form.track_stock,
});

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Produk berhasil ditambahkan.");

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#FFF8F3] p-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="mb-8 text-4xl font-black text-pink-600">
          Tambah Produk
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

          <div className="flex gap-4">

            <button
              onClick={() => router.back()}
              className="w-1/2 rounded-full border py-4"
            >
              Batal
            </button>

            <button
              onClick={saveProduct}
              disabled={loading}
              className="w-1/2 rounded-full bg-pink-600 py-4 font-bold text-white"
            >
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}