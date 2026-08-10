"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Search, Plus, Pencil, Trash2, Star, GripVertical} from "lucide-react";

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

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
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
      ? "scale-[1.02] shadow-2xl ring-2 ring-pink-300 z-50"
      : ""
  }`}
>
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 flex h-10 w-10 touch-none items-center justify-center rounded-xl bg-gray-100 text-gray-500 shadow-sm transition active:scale-95 active:cursor-grabbing"
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
            <div>
              <h3 className="font-semibold text-slate-900">
                {product.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-600 ring-1 ring-yellow-100">
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
  .from("products")
  .select("*")
  .order("sort_order", {
    ascending: true,
  });

    if (error) {
      alert(error.message);
      return;
    }

    setProducts(data || []);
    setLoading(false);
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

    loadProducts();
  }

  async function handleDragEnd(event: any) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = products.findIndex(
    (p) => p.id === active.id
  );

  const newIndex = products.findIndex(
    (p) => p.id === over.id
  );

  const reordered = arrayMove(
    products,
    oldIndex,
    newIndex
  );

  setProducts(reordered);

  // simpan urutan ke database
  await Promise.all(
    reordered.map((product, index) =>
      supabase
        .from("products")
        .update({
          sort_order: index + 1,
        })
        .eq("id", product.id)
    )
  );
}

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

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
  {/* Header Simple Premium */}
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

  {/* Search Minimal */}
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
</div>

      {/* Table Desktop */}
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
            {filteredProducts.map((product) => (
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
                      onClick={() => deleteProduct(product.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-10 text-center text-gray-500"
                >
                  Produk tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={filteredProducts.map((p) => p.id)}
    strategy={verticalListSortingStrategy}
  >
    <div className="space-y-4 lg:hidden">
      {filteredProducts.map((product) => (
        <SortableProductCard
          key={product.id}
          product={product}
          onDelete={deleteProduct}
        />
      ))}

      {filteredProducts.length === 0 && (
        <div className="rounded-3xl border border-pink-100 bg-white p-10 text-center text-gray-500 shadow-sm">
          Produk tidak ditemukan.
        </div>
      )}
    </div>
  </SortableContext>
</DndContext>
    </main>
  );
}