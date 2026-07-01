import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/supabase/products";

export default async function Menu() {
  const products = await getProducts();

  return (
    <section
      id="menu"
      className="bg-gradient-to-b from-[#FFF8F3] to-white py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-block rounded-full bg-pink-100 px-6 py-2 text-sm font-semibold text-pink-600">
            🍩 Menu Favorit
          </span>

          <h2 className="mt-6 text-4xl font-black text-gray-900 md:text-6xl">
            Donat Favorit
            <span className="block text-pink-600">
              Pilihan Pelanggan
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Semua donat dibuat setiap hari menggunakan bahan premium,
            topping berkualitas, dan tekstur yang lembut di setiap gigitan.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              rating={product.rating}
              description={product.description}
            />
          ))}

        </div>

        <div className="mt-20 text-center">

          <a
            href="https://wa.me/6287837970001?text=Halo%20Donara,%20saya%20ingin%20melihat%20semua%20menu."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-pink-600 px-10 py-4 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-pink-700"
          >
            Lihat Semua Menu di WhatsApp
          </a>

        </div>

      </div>
    </section>
  );
}