"use client";

import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  image?: string;
  category: string;
  is_package: boolean;
  package_size?: number;
  [key: string]: any;
}

interface ProductGridProps {
  products: Product[];
  todayStock: any;
  onPackageClick: (product: any) => void;
  onProductClick: (product: any) => void;
  cart?: any[];
}

export default function ProductGrid({
  products,
  todayStock,
  onPackageClick,
  onProductClick,
  cart = [],
}: ProductGridProps) {
  const categories = products.reduce(
    (
      acc: { [key: string]: Product[] },
      product
    ) => {
      const cat = product.category || "Lainnya";

      if (!acc[cat]) {
        acc[cat] = [];
      }

      acc[cat].push(product);

      return acc;
    },
    {}
  );

  return (
    <div className="space-y-10">
      {Object.entries(categories).map(
        ([categoryName, items]) => (
          <section
            key={categoryName}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-pink-500" />

              <h2 className="text-xl font-black text-gray-900 md:text-2xl">
                🍩 {categoryName}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {items.map((product) => {
                const handleItemClick = () => {
                  if (product.is_package) {
                    onPackageClick(product);
                  } else {
                    onProductClick(product);
                  }
                };

                const finalImageUrl =
                  product.image_url || product.image;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={handleItemClick}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                      product.is_package
                        ? "border-pink-100 hover:border-pink-300"
                        : "border-gray-100 hover:border-pink-200"
                    }`}
                  >
                    {/* Gambar */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                      {finalImageUrl ? (
                        <Image
                          src={finalImageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                          No Image
                        </div>
                      )}

                      {/* Badge Paket */}
                      {product.is_package && (
                        <span className="absolute left-2 top-2 rounded-lg bg-pink-600 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                          Isi {product.package_size} Pcs
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="mt-3 flex flex-1 flex-col justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-bold leading-tight text-gray-800">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-black text-pink-600 md:text-base">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )
      )}
    </div>
  );
}