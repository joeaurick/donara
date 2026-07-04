"use client";

import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category: string;
  is_package: boolean;
  package_size?: number;
  [key: string]: any; // Mengizinkan properti tambahan seperti image atau package_type
}

interface ProductGridProps {
  products: Product[];
  todayStock: any;
  onPackageClick: (product: any) => void; // Diubah ke any agar kompatibel dengan hook picker
  cart?: any[];
}

export default function ProductGrid({
  products,
  todayStock,
  onPackageClick,
  cart = [],
}: ProductGridProps) {
  
  // Mengelompokkan produk berdasarkan kategori
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
              const productId = product.id;
              const initialStock = todayStock?.remaining_stock || 0;

              const cartQty = (cart?.find((item: any) => item.id === productId) as any)?.qty || 
                              (cart?.find((item: any) => item.id === productId) as any)?.quantity || 0;

              const currentStock = Math.max(0, initialStock - cartQty);

              return (
                <div
                  key={product.id}
                  onClick={() => product.is_package && onPackageClick(product)}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white p-3 shadow-sm transition-all hover:shadow-md ${
                    product.is_package ? "cursor-pointer border-pink-100 hover:border-pink-300" : "border-gray-100"
                  }`}
                >
                  {/* Gambar Produk */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
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
                      {!product.is_package && (
                        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                          currentStock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        }`}>
                          Sisa: {currentStock}
                        </span>
                      )}
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