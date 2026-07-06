"use client";

import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  image?: string; // Menambahkan alternatif field gambar dari database Anda
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
  
  const categories = products.reduce((acc: { [key: string]: Product[] }, product) => {
    const cat = product.category || "Lainnya";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(categories).map(([categoryName, items]) => (
        <div key={categoryName} className="space-y-4">
          <h2 className="text-lg font-black uppercase tracking-wide text-pink-600 flex items-center gap-2">
            🍩 {categoryName}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((product) => {
              
              const handleItemClick = () => {
                if (product.is_package) {
                  onPackageClick(product);
                } else {
                  onProductClick(product);
                }
              };

              // Menentukan path gambar yang valid dari properti database Anda
              const finalImageUrl = product.image_url || product.image;

              return (
                <div
                  key={product.id}
                  onClick={handleItemClick}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-3 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                    product.is_package ? "border-pink-100 hover:border-pink-300" : "border-gray-100 hover:border-pink-200"
                  }`}
                >
                  {/* Gambar Produk */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                    {finalImageUrl ? (
                      <Image
                        src={finalImageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                        priority={true}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 text-xs">
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

                  {/* Info Produk */}
                  <div className="mt-3 flex flex-1 flex-col justify-between space-y-1">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-black text-pink-600">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}