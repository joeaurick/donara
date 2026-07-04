"use client";

import { useCart } from "../context/CartContext";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;

  is_package: boolean;
  package_size: number;

  category: string | null;
  package_type: string | null;
};

type Props = {
  products: Product[];

  onPackageClick?: (product: Product) => void;
};

export default function ProductGrid({
  products,
  onPackageClick,
}: Props) {
  const { addToCart } = useCart();

  const packages = products.filter(
    (x) => x.is_package
  );

  const donuts = products.filter(
    (x) => !x.is_package
  );

  return (
    <div className="space-y-8">

      {/* ===================== */}
      {/* PAKET */}
      {/* ===================== */}

      {packages.length > 0 && (

        <section>

          <h2 className="mb-4 text-xl font-black text-pink-600">
            📦 Paket
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {packages.map((item) => (

              <button
                key={item.id}
                onClick={() => {
                  if (onPackageClick) {
                    onPackageClick(item);
                  }
                }}
                className="rounded-2xl border-2 border-pink-300 bg-pink-50 p-6 text-left transition hover:border-pink-600 hover:shadow-lg"
              >

                <div className="text-4xl">
                  📦
                </div>

                <h3 className="mt-4 text-lg font-black">
                  {item.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {item.package_size} Donat Bebas Pilih
                </p>

                <div className="mt-5 flex items-end justify-between">

                  <span className="text-xl font-black text-pink-600">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>

                  <span className="rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white">
                    {item.package_size} PCS
                  </span>

                </div>

              </button>

            ))}

          </div>

        </section>

      )}

      {/* ===================== */}
      {/* DONAT */}
      {/* ===================== */}

      <section>

        <h2 className="mb-4 text-xl font-black text-pink-600">
          🍩 Donat
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

          {donuts.map((product) => (

            <button
              key={product.id}
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  isPackage: false,
                })
              }
              className="group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
            >

              <div className="overflow-hidden">

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                />

              </div>

              <div className="p-4">

                <h2 className="line-clamp-2 min-h-[48px] text-sm font-bold">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-center justify-between">

                  <span className="text-lg font-black text-pink-600">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-xl font-bold text-white transition group-hover:rotate-90">
                    +
                  </div>

                </div>

              </div>

            </button>

          ))}

        </div>

      </section>

    </div>
  );
}