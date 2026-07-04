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
  todayStock?: any; // Tambahkan properti data stok harian dari parent dashboard
  onPackageClick?: (product: Product) => void;
};

export default function ProductGrid({
  products,
  todayStock,
  onPackageClick,
}: Props) {
  const { addToCart, cart } = useCart(); // Ambil data cart untuk menghitung stok real-time saat transaksi berjalan

  const packages = products.filter((x) => x.is_package);
  const donuts = products.filter((x) => !x.is_package);

  // Fungsi pembantu untuk menghitung sisa stok dinamis di UI
  const getProductStockInfo = (productId: number) => {
    if (!todayStock || !todayStock.items) return { initial: null, current: null };
    
    // Cari stok awal dari data daily stock Supabase berdasarkan ID produk
    const stockItem = todayStock.items.find((item: any) => item.product_id === productId);
    if (!stockItem) return { initial: 0, current: 0 };

    const initialStock = stockItem.stock || 0;

    // Hitung berapa jumlah item ini yang sudah masuk ke keranjang belanja kasir saat ini
    const cartQty = cart?.find((item: any) => item.id === productId)?.quantity || 0;
    
    // Sisa stok riil di layar = Stok awal hari ini - Jumlah di keranjang kasir
    const currentStock = Math.max(0, initialStock - cartQty);

    return { initial: initialStock, current: currentStock };
  };

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
                <div className="text-4xl">📦</div>
                <h3 className="mt-4 text-lg font-black">{item.name}</h3>
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
          {donuts.map((product) => {
            const { current: remainingStock } = getProductStockInfo(product.id);
            const isOutOfStock = remainingStock !== null && remainingStock <= 0;

            return (
              <button
                key={product.id}
                disabled={isOutOfStock}
                onClick={() =>
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    isPackage: false,
                  })
                }
                className={`group relative overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all duration-200 
                  ${isOutOfStock 
                    ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" 
                    : "hover:-translate-y-1 hover:shadow-xl active:scale-95 border-gray-100"
                  }`}
              >
                {/* INDIKATOR BADGE STOK */}
                {remainingStock !== null && (
                  <div className={`absolute left-2 top-2 z-10 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-sm
                    ${isOutOfStock 
                      ? "bg-red-600 text-white" 
                      : remainingStock < 5 
                        ? "bg-amber-500/90 text-white" 
                        : "bg-black/70 text-white"
                    }`}
                  >
                    {isOutOfStock ? "❌ Habis" : `Stok: ${remainingStock}`}
                  </div>
                )}

                <div className="overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`h-36 w-full object-cover transition duration-300 ${!isOutOfStock && "group-hover:scale-105"}`}
                  />
                </div>

                <div className="p-4">
                  <h2 className="line-clamp-2 min-h-[48px] text-sm font-bold text-gray-800">
                    {product.name}
                  </h2>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-pink-600">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>

                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-white transition
                      ${isOutOfStock 
                        ? "bg-gray-300" 
                        : "bg-pink-600 group-hover:rotate-90 active:bg-pink-700"
                      }`}
                    >
                      {isOutOfStock ? "✓" : "+"}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}