"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowLeft,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at?: string;
};

function SortableCategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: ProductCategory;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm transition-all ${
        isDragging
          ? "scale-[1.02] shadow-xl ring-2 ring-pink-300"
          : ""
      }`}
    >
      {/* DRAG HANDLE */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex h-10 w-10 shrink-0 touch-none items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition active:scale-95 active:cursor-grabbing"
        aria-label={`Atur urutan ${category.name}`}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* CATEGORY INFO */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-black text-slate-900">
          {category.name}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          ID kategori: {category.slug}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
          aria-label={`Edit ${category.name}`}
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(category)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
          aria-label={`Hapus ${category.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<
    ProductCategory[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ProductCategory | null>(null);

  const [categoryName, setCategoryName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8,
      },
    })
  );

  useEffect(() => {
    loadCategories();
  }, []);

  // =========================
  // LOAD CATEGORIES
  // =========================
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

    setCategories(data ?? []);
    setLoading(false);
  }

  // =========================
  // CREATE SLUG
  // =========================
  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // =========================
  // OPEN ADD FORM
  // =========================
  function handleAddCategory() {
    setEditingCategory(null);
    setCategoryName("");
    setShowForm(true);
  }

  // =========================
  // OPEN EDIT FORM
  // =========================
  function handleEditCategory(
    category: ProductCategory
  ) {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowForm(true);
  }

  // =========================
  // CLOSE FORM
  // =========================
  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingCategory(null);
    setCategoryName("");
  }

  // =========================
  // SAVE CATEGORY
  // =========================
  async function saveCategory() {
    const cleanName = categoryName.trim();

    if (!cleanName) {
      alert("Nama kategori wajib diisi.");
      return;
    }

    const slug = createSlug(cleanName);

    if (!slug) {
      alert("Nama kategori tidak valid.");
      return;
    }

    setSaving(true);

    try {
      // =====================
      // EDIT CATEGORY
      // =====================
      if (editingCategory) {
        const { error } = await supabase
          .from("product_categories")
          .update({
            name: cleanName,
            slug,
          })
          .eq("id", editingCategory.id);

        if (error) {
          throw error;
        }

        alert("Kategori berhasil diperbarui.");
      } else {
        // =====================
        // NEW CATEGORY
        // =====================
        const nextSortOrder =
          categories.length > 0
            ? Math.max(
                ...categories.map(
                  (category) =>
                    category.sort_order ?? 0
                )
              ) + 1
            : 1;

        const { error } = await supabase
          .from("product_categories")
          .insert({
            name: cleanName,
            slug,
            sort_order: nextSortOrder,
          });

        if (error) {
          throw error;
        }

        alert("Kategori berhasil ditambahkan.");
      }

      closeForm();
      await loadCategories();
    } catch (error: any) {
      alert(
        error?.message ||
          "Terjadi kesalahan saat menyimpan kategori."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // DELETE CATEGORY
  // =========================
  async function handleDeleteCategory(
    category: ProductCategory
  ) {
    // Cek jumlah produk dalam kategori
    const { count, error: countError } =
      await supabase
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

    if ((count ?? 0) > 0) {
      alert(
        `Kategori "${category.name}" tidak dapat dihapus karena masih memiliki ${count} produk. Pindahkan atau hapus produknya terlebih dahulu.`
      );

      return;
    }

    const confirmed = confirm(
      `Yakin ingin menghapus kategori "${category.name}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("product_categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Kategori berhasil dihapus.");

    await loadCategories();
  }

  // =========================
  // DRAG CATEGORY
  // =========================
  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categories.findIndex(
      (category) =>
        category.id === active.id
    );

    const newIndex = categories.findIndex(
      (category) =>
        category.id === over.id
    );

    if (
      oldIndex === -1 ||
      newIndex === -1
    ) {
      return;
    }

    const reordered = arrayMove(
      categories,
      oldIndex,
      newIndex
    );

    // Update langsung di UI
    setCategories(reordered);

    try {
      const results = await Promise.all(
        reordered.map(
          (category, index) =>
            supabase
              .from("product_categories")
              .update({
                sort_order: index + 1,
              })
              .eq("id", category.id)
        )
      );

      const failed = results.find(
        (result) => result.error
      );

      if (failed?.error) {
        throw failed.error;
      }

      await loadCategories();
    } catch (error: any) {
      alert(
        error?.message ||
          "Gagal menyimpan urutan kategori."
      );

      await loadCategories();
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
    <main className="mx-auto max-w-3xl space-y-6">
      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-pink-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Produk
          </Link>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            Kelola Kategori
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Tambah, edit, hapus, dan atur urutan
            kategori produk.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddCategory}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </button>
      </div>

      {/* =========================
          CATEGORY LIST
      ========================= */}
      <div className="rounded-3xl border border-pink-100 bg-pink-50/40 p-4 shadow-sm">
        <div className="mb-4 px-2">
          <p className="text-xs font-black uppercase tracking-wider text-slate-700">
            Urutan Kategori
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Geser menggunakan ikon di sebelah kiri
            untuk mengubah urutan kategori.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map(
              (category) => category.id
            )}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {categories.map((category) => (
                <SortableCategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ))}

              {categories.length === 0 && (
                <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-10 text-center">
                  <p className="font-semibold text-slate-700">
                    Belum ada kategori.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Tambahkan kategori produk pertama.
                  </p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-pink-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {editingCategory
                    ? "Edit Kategori"
                    : "Tambah Kategori"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingCategory
                    ? "Perbarui nama kategori produk."
                    : "Buat kategori produk baru."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nama Kategori
              </label>

              <input
                autoFocus
                type="text"
                placeholder="Contoh: Minuman"
                value={categoryName}
                onChange={(e) =>
                  setCategoryName(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveCategory();
                  }
                }}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
              />

              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                ID kategori akan dibuat otomatis dari
                nama kategori.
              </p>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex gap-3 border-t border-pink-100 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={saveCategory}
                disabled={saving}
                className="flex-1 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
              >
                {saving
                  ? "Menyimpan..."
                  : editingCategory
                  ? "Simpan Perubahan"
                  : "Tambah Kategori"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}