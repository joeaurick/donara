"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ImageUpload from "../../../../components/ImageUpload";

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export default function NewProductPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    rating: 5,
    description: "",
    category_id: "",
    track_stock: true,

    // TAMBAHAN PROMO
    promo_code: "NORMAL",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setCategoriesLoading(true);

    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      alert(error.message);
      setCategoriesLoading(false);
      return;
    }

    const categoryData = data || [];

    setCategories(categoryData);

    if (categoryData.length > 0) {
      setForm((currentForm) => ({
        ...currentForm,
        category_id: categoryData[0].id,
      }));
    }

    setCategoriesLoading(false);
  }

  async function saveProduct() {
    if (
      !form.name.trim() ||
      !form.price ||
      !form.image.trim() ||
      !form.description.trim() ||
      !form.category_id
    ) {
      alert("Semua data wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const selectedCategory = categories.find(
        (category) => category.id === form.category_id
      );

      const { error } = await supabase
        .from("products")
        .insert({
          name: form.name.trim(),
          price: Number(form.price),
          image: form.image.trim(),
          rating: form.rating,
          description: form.description.trim(),

          // KATEGORI BARU
          category_id: form.category_id,

          // KOMPATIBILITAS DATA LAMA
          category: selectedCategory?.slug || null,

          track_stock: form.track_stock,

          // PROMO
          promo_code: form.promo_code || null,

          // Produk baru masuk paling bawah
          sort_order: null,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Produk berhasil ditambahkan.");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
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

          {/* KATEGORI DINAMIS */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Kategori Produk
            </label>

            <select
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
              value={form.category_id}
              disabled={categoriesLoading || categories.length === 0}
              onChange={(e) =>
                setForm({
                  ...form,
                  category_id: e.target.value,
                })
              }
            >
              {categoriesLoading && (
                <option value="">Memuat kategori...</option>
              )}

              {!categoriesLoading && categories.length === 0 && (
                <option value="">Belum ada kategori</option>
              )}

              {!categoriesLoading &&
                categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>

            {!categoriesLoading && categories.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                Belum ada kategori. Silakan tambahkan kategori terlebih dahulu.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Promo Produk
            </label>

            <select
              value={form.promo_code}
              onChange={(e) =>
                setForm({
                  ...form,
                  promo_code: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
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

            <p className="mt-2 text-sm text-slate-500">
              Pilih promo yang akan dihitung otomatis di kasir.
            </p>
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
                Aktifkan untuk produk yang stoknya perlu dikurangi.
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
              disabled={
                loading ||
                categoriesLoading ||
                categories.length === 0
              }
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