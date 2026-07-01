"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id");

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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main className="p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="p-10">

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-black text-pink-600">
            Kelola Produk
          </h1>

          <p className="mt-2 text-gray-500">
            Total Produk: {filteredProducts.length}
          </p>

        </div>

        <Link
          href="/admin/products/new"
          className="rounded-full bg-pink-600 px-6 py-3 font-bold text-white hover:bg-pink-700"
        >
          + Tambah Produk
        </Link>

      </div>

      <input
        type="text"
        placeholder="Cari produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full rounded-2xl border p-4 focus:border-pink-500 focus:outline-none"
      />

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

        <table className="w-full">

          <thead className="bg-pink-600 text-white">

            <tr>

              <th className="p-4">Gambar</th>
              <th className="p-4 text-left">Nama</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Aksi</th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.map((product) => (

              <tr
                key={product.id}
                className="border-b"
              >

                <td className="p-4 text-center">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="mx-auto h-16 w-16 rounded-xl object-cover"
                  />

                </td>

                <td className="font-semibold">
                  {product.name}
                </td>

                <td className="text-center">
                  Rp {product.price.toLocaleString("id-ID")}
                </td>

                <td className="text-center">
                  ⭐ {product.rating}
                </td>

                <td className="space-x-2 text-center">

                  <Link
                    href={`/admin/products/${product.id}`}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Hapus
                  </button>

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

    </main>
  );
}