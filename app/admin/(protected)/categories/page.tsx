"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  X,
  Check,
  Layers3,
  Package,
} from "lucide-react";

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");

  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);

    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .order("sort_order", {
        ascending: true,
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setCategories(data || []);
    setLoading(false);
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function addCategory() {
  const trimmedName = name.trim();

  if (!trimmedName) {
    alert("Nama kategori wajib diisi.");
    return;
  }

  const baseSlug = generateSlug(trimmedName);

  if (!baseSlug) {
    alert("Nama kategori tidak valid.");
    return;
  }

  const existingSlugs = categories.map(
    (category) => category.slug
  );

  let finalSlug = baseSlug;
  let counter = 2;

  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  setSaving(true);

  const { error } = await supabase
    .from("product_categories")
    .insert({
      name: trimmedName,
      slug: finalSlug,
      sort_order: categories.length + 1,
    });

  setSaving(false);

  if (error) {
    alert(error.message);
    return;
  }

  setName("");

  await loadCategories();
}

  function startEdit(category: ProductCategory) {
    setEditingCategory(category);
    setName(category.name);
  }

  function cancelEdit() {
    setEditingCategory(null);
    setName("");
  }

  async function updateCategory() {
    if (!editingCategory) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Nama kategori wajib diisi.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("product_categories")
      .update({
        name: trimmedName,
        slug: generateSlug(trimmedName),
      })
      .eq("id", editingCategory.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    cancelEdit();

    await loadCategories();
  }

  async function deleteCategory(category: ProductCategory) {
    const ok = confirm(
      `Yakin ingin menghapus kategori "${category.name}"?`
    );

    if (!ok) return;

    const { count, error: countError } = await supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("category_id", category.id);

    if (countError) {
      alert(countError.message);
      return;
    }

    if ((count || 0) > 0) {
      alert(
        `Kategori "${category.name}" tidak bisa dihapus karena masih memiliki ${count} produk.`
      );
      return;
    }

    const { error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadCategories();
  }

  async function submitCategory() {
    if (editingCategory) {
      await updateCategory();
      return;
    }

    await addCategory();
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
            <Layers3 className="h-6 w-6 animate-pulse" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Memuat kategori...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#281711] via-[#43261b] to-[#2d1a15] p-6 text-white shadow-[0_14px_35px_rgba(60,30,20,0.18)] md:p-8">
        {/* DECORATION */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-500/20 blur-2xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-orange-400/10 blur-2xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5">
              <Tag className="h-3.5 w-3.5 text-pink-300" />

              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-pink-100">
                Product Management
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight md:text-3xl">
              Kelola Kategori Produk
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
              Tambahkan, ubah, dan hapus kategori produk sesuai kebutuhan bisnis Anda.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-950/20">
              <Layers3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                Total Kategori
              </p>

              <p className="text-xl font-black">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_10px_30px_rgba(60,30,20,0.05)]">
        <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50/70 via-white to-pink-50/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                editingCategory
                  ? "bg-blue-50 text-blue-600"
                  : "bg-pink-50 text-pink-600"
              }`}
            >
              {editingCategory ? (
                <Pencil className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 className="font-black text-slate-800">
                {editingCategory
                  ? "Edit Kategori"
                  : "Tambah Kategori Baru"}
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {editingCategory
                  ? `Mengubah kategori ${editingCategory.name}`
                  : "Buat kategori baru untuk produk Anda"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Contoh: Makanan, Minuman, Paket..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitCategory();
                  }
                }}
                disabled={saving}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100 disabled:opacity-60"
              />
            </div>

            <button
              type="button"
              onClick={submitCategory}
              disabled={saving}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60 ${
                editingCategory
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              }`}
            >
              {editingCategory ? (
                <>
                  <Check className="h-4 w-4" />
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {saving ? "Menambahkan..." : "Tambah Kategori"}
                </>
              )}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Batal
              </button>
            )}
          </div>
        </div>
      </section>

      {/* LIST KATEGORI */}
      <section className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_10px_30px_rgba(60,30,20,0.05)]">
        <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50/30 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black text-slate-800">
                Daftar Kategori
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Kategori yang tersedia untuk produk
              </p>
            </div>
          </div>

          <span className="rounded-full bg-pink-50 px-3 py-1.5 text-xs font-black text-pink-600 ring-1 ring-pink-100">
            {categories.length} Kategori
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
              <Tag className="h-7 w-7" />
            </div>

            <h3 className="mt-4 font-black text-slate-700">
              Belum ada kategori
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Tambahkan kategori pertama untuk mulai mengelola produk.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-orange-50">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`group flex flex-col gap-4 px-5 py-5 transition hover:bg-orange-50/30 sm:flex-row sm:items-center sm:px-6 ${
                  editingCategory?.id === category.id
                    ? "bg-blue-50/40"
                    : ""
                }`}
              >
                {/* NOMOR */}
                <div className="flex items-center gap-4 sm:contents">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600">
                    {index + 1}
                  </div>

                  {/* ICON */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-orange-50 text-pink-500 ring-1 ring-pink-100">
                    <Tag className="h-5 w-5" />
                  </div>

                  {/* INFO */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-black text-slate-800">
                      {category.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">
                        /{category.slug}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        Urutan #{category.sort_order}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AKSI */}
                <div className="flex gap-2 sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    disabled={saving}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 text-sm font-bold text-blue-600 transition hover:bg-blue-100 disabled:opacity-60 sm:flex-none"
                  >
                    <Pencil className="h-4 w-4" />

                    <span className="sm:hidden">
                      Edit
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category)}
                    disabled={saving}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60 sm:flex-none"
                  >
                    <Trash2 className="h-4 w-4" />

                    <span className="sm:hidden">
                      Hapus
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}