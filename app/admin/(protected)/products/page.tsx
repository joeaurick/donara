"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Star,
  GripVertical,
  Tag,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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
};

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  category: string | null;
  category_id: string | null;
  sort_order: number | null;
};

function SortableProductCard({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-3xl border border-pink-100 bg-white p-4 shadow-sm transition-all ${
        isDragging
          ? "z-50 scale-[1.02] shadow-2xl ring-2 ring-pink-300"
          : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 flex h-10 w-10 touch-none items-center justify-center rounded-xl bg-gray-100 text-gray-500 shadow-sm transition active:scale-95 active:cursor-grabbing"
          title="Geser untuk mengubah urutan"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="h-20 w-20 rounded-2xl border border-pink-100 object-cover shadow-sm"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">
                {product.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-600 ring-1 ring-yellow-100">
              <Star className="h-3.5 w-3.5 fill-current" />
              {product.rating}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/admin/products/${product.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Hapus
        </button>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

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
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [productsResult, categoriesResult] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .order("sort_order", {
            ascending: true,
          }),

        supabase
          .from("product_categories")
          .select("*")
          .order("sort_order", {
            ascending: true,
          }),
      ]);

      if (productsResult.error) {
        alert(productsResult.error.message);
        return;
      }

      if (categoriesResult.error) {
        alert(categoriesResult.error.message);
        return;
      }

      setProducts(productsResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data produk.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: number) {
    const ok = confirm("Yakin ingin menghapus produk ini?");

    if (!ok) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadData();
  }

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(keyword)
    );
  }, [products, search]);

  const categoryGroups = useMemo(() => {
    const groups = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      sort_order: category.sort_order,
      products: filteredProducts
        .filter((product) => product.category_id === category.id)
        .sort(
          (a, b) =>
            (a.sort_order ?? Number.MAX_SAFE_INTEGER) -
            (b.sort_order ?? Number.MAX_SAFE_INTEGER)
        ),
    }));

    const uncategorizedProducts = filteredProducts.filter(
      (product) =>
        !product.category_id ||
        !categories.some(
          (category) => category.id === product.category_id
        )
    );

    if (uncategorizedProducts.length > 0) {
      groups.push({
        id: "uncategorized",
        name: "Tanpa Kategori",
        slug: "uncategorized",
        sort_order: Number.MAX_SAFE_INTEGER,
        products: uncategorizedProducts.sort(
          (a, b) =>
            (a.sort_order ?? Number.MAX_SAFE_INTEGER) -
            (b.sort_order ?? Number.MAX_SAFE_INTEGER)
        ),
      });
    }

    return groups;
  }, [categories, filteredProducts]);

  async function handleDragEnd(
    event: DragEndEvent,
    categoryId: string
  ) {
    const { active, over } = event;

    if (!over || active.id === over.id || savingOrder) {
      return;
    }

    const categoryProducts = products
      .filter((product) => product.category_id === categoryId)
      .sort(
        (a, b) =>
          (a.sort_order ?? Number.MAX_SAFE_INTEGER) -
          (b.sort_order ?? Number.MAX_SAFE_INTEGER)
      );

    const oldIndex = categoryProducts.findIndex(
      (product) => product.id === active.id
    );

    const newIndex = categoryProducts.findIndex(
      (product) => product.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedCategoryProducts = arrayMove(
      categoryProducts,
      oldIndex,
      newIndex
    );

    const reorderedIds = new Set(
      reorderedCategoryProducts.map((product) => product.id)
    );

    const otherProducts = products.filter(
      (product) => !reorderedIds.has(product.id)
    );

    const updatedCategoryProducts =
      reorderedCategoryProducts.map((product, index) => ({
        ...product,
        sort_order: index + 1,
      }));

    const updatedProducts = [
      ...otherProducts,
      ...updatedCategoryProducts,
    ];

    setProducts(updatedProducts);
    setSavingOrder(true);

    try {
      const results = await Promise.all(
        updatedCategoryProducts.map((product) =>
          supabase
            .from("products")
            .update({
              sort_order: product.sort_order,
            })
            .eq("id", product.id)
        )
      );

      const updateError = results.find(
        (result) => result.error
      )?.error;

      if (updateError) {
        alert(updateError.message);
        await loadData();
        return;
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan urutan produk.");
      await loadData();
    } finally {
      setSavingOrder(false);
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
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Kelola Produk
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {filteredProducts.length} produk tersedia
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100"
          />
        </div>

        {savingOrder && (
          <p className="text-sm text-pink-600">
            Menyimpan urutan produk...
          </p>
        )}
      </div>

      {/* Kategori Produk */}
      {categoryGroups.map((group) => {
        if (group.products.length === 0 && !search.trim()) {
          return (
            <section
              key={group.id}
              className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 border-b border-pink-50 bg-pink-50/50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                  <Tag className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    {group.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Belum ada produk
                  </p>
                </div>
              </div>

              <div className="p-10 text-center text-slate-500">
                Belum ada produk dalam kategori ini.
              </div>
            </section>
          );
        }

        if (group.products.length === 0) {
          return null;
        }

        return (
          <section
            key={group.id}
            className="space-y-4"
          >
            {/* Judul Kategori */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                <Tag className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {group.name}
                </h2>

                <p className="text-sm text-slate-500">
                  {group.products.length} produk
                </p>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm lg:block">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  <tr>
                    <th className="p-4 text-left">Gambar</th>
                    <th className="p-4 text-left">Nama</th>
                    <th className="p-4 text-left">Harga</th>
                    <th className="p-4 text-left">Rating</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {group.products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-pink-50 hover:bg-pink-50/40"
                    >
                      <td className="p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-16 w-16 rounded-2xl border border-pink-100 object-cover shadow-sm"
                        />
                      </td>

                      <td className="p-4 font-semibold text-slate-900">
                        {product.name}
                      </td>

                      <td className="p-4 text-slate-700">
                        Rp {product.price.toLocaleString("id-ID")}
                      </td>

                      <td className="p-4">
                        <div className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-600 ring-1 ring-yellow-100">
                          <Star className="h-4 w-4 fill-current" />
                          {product.rating}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(product.id)
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile + Drag & Drop */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) =>
                handleDragEnd(event, group.id)
              }
            >
              <SortableContext
                items={group.products.map(
                  (product) => product.id
                )}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4 lg:hidden">
                  {group.products.map((product) => (
                    <SortableProductCard
                      key={product.id}
                      product={product}
                      onDelete={deleteProduct}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </section>
        );
      })}

      {categoryGroups.length === 0 && (
        <div className="rounded-3xl border border-pink-100 bg-white p-10 text-center text-gray-500 shadow-sm">
          Produk tidak ditemukan.
        </div>
      )}

      {filteredProducts.length === 0 &&
        categoryGroups.length > 0 &&
        search.trim() && (
          <div className="rounded-3xl border border-pink-100 bg-white p-10 text-center text-gray-500 shadow-sm">
            Produk tidak ditemukan.
          </div>
        )}
    </main>
  );
}