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

  // TAMBAHAN
  promo_code: "NORMAL",
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
  price: data.price.toString(),
  image: data.image,
  rating: data.rating,
  description: data.description,
  category: data.category,
  track_stock: data.track_stock,

  // TAMBAHAN
  promo_code: data.promo_code || "NORMAL",
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
  promo_code: form.promo_code,
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
      <div className="py-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Edit Produk
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Perbarui informasi produk Donara.
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
              placeholder="Nama Produk"
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
                placeholder="Harga"
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
    Tipe Promo
  </label>

  <select
    className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
    value={form.promo_code}
    onChange={(e) =>
      setForm({
        ...form,
        promo_code: e.target.value,
      })
    }
  >
    <option value="NORMAL">
      Normal (Tanpa Promo)
    </option>

    <option value="DONAT_3">
      Donat Hemat 3 pcs (Rp 10.000)
    </option>

    <option value="DONAT_6">
      Donat Hemat 6 pcs (Rp 23.000)
    </option>
  </select>
</div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Deskripsi Produk
            </label>

            <textarea
              className="h-36 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
              placeholder="Deskripsi Produk"
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
              onClick={updateProduct}
              disabled={saving}
              className="rounded-2xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}