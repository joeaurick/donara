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
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Tambah Produk
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Tambahkan produk baru untuk ditampilkan di website Donara.
        </p>
      </div>

      <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nama Produk
            </label>

            <input
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
              placeholder="Contoh: Donat Tiramisu"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Harga
              </label>

              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
                type="number"
                placeholder="4000"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Rating
              </label>

              <select
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
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
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Gambar Produk
            </label>

            <ImageUpload
              value={form.image}
              onChange={(url) =>
                setForm({
                  ...form,
                  image: url,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Kategori Produk
            </label>

            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            >
              <option value="normal">Produk Normal</option>
              <option value="donat">Donat</option>
              <option value="minuman">Minuman</option>
              <option value="snack">Snack</option>
              <option value="paket">Paket</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Deskripsi Produk
            </label>

            <textarea
              className="h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
              placeholder="Tulis deskripsi produk..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
            <div>
              <p className="font-semibold text-slate-900">
                Kurangi stok harian
              </p>

              <p className="text-sm text-slate-500">
                Aktifkan untuk produk donat.
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.track_stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  track_stock: e.target.checked,
                })
              }
              className="h-5 w-5 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={saveProduct}
              disabled={loading}
              className="rounded-2xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}