"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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

function animateToCart(sourceElement: HTMLElement) {
  const cartButton = document.getElementById("mobile-cart-button");

  if (!cartButton) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = cartButton.getBoundingClientRect();

  const clone = sourceElement.cloneNode(true) as HTMLElement;

  clone.style.position = "fixed";
  clone.style.left = `${sourceRect.left}px`;
  clone.style.top = `${sourceRect.top}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.zIndex = "9999";
  clone.style.pointerEvents = "none";
  clone.style.borderRadius = "20px";
  clone.style.overflow = "hidden";
  clone.style.transition =
    "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease";

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    const translateX =
      targetRect.left + targetRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2);

    const translateY =
      targetRect.top + targetRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2);

    clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.12)`;
    clone.style.opacity = "0.15";
  });

  setTimeout(() => {
    clone.remove();

    cartButton.classList.add("cart-bounce");

    setTimeout(() => {
      cartButton.classList.remove("cart-bounce");
    }, 500);
  }, 700);
}

export default function ProductGrid({
  products,
  todayStock,
  onPackageClick,
  onProductClick,
  cart = [],
}: ProductGridProps) {
  const categories = products.reduce(
    (acc: { [key: string]: Product[] }, product) => {
      const cat = product.category || "Lainnya";

      if (!acc[cat]) acc[cat] = [];

      acc[cat].push(product);

      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      {Object.entries(categories).map(([categoryName, items]) => (
        <div key={categoryName} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <span className="text-lg">🍩</span>
            <h2 className="text-lg font-black capitalize text-gray-800">
              {categoryName}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {items.map((product) => {
              const finalImageUrl = product.image_url || product.image;

              const handleItemClick = (
                e: React.MouseEvent<HTMLButtonElement>
              ) => {
                animateToCart(e.currentTarget);

                setTimeout(() => {
                  if (product.is_package) {
                    onPackageClick(product);
                  } else {
                    onProductClick(product);
                  }
                }, 120);
              };

              return (
                <motion.button
                  key={product.id}
                  type="button"
                  onClick={handleItemClick}
                  whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-pink-200 hover:shadow-lg active:shadow-pink-200/40"
                >
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-pink-300 opacity-0"
                    whileTap={{
                      opacity: [0, 0.35, 0],
                      scale: [1, 1.05, 1.08],
                    }}
                    transition={{ duration: 0.35 }}
                  />

                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                    {finalImageUrl ? (
                      <Image
                        src={finalImageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                        No Image
                      </div>
                    )}

                    {product.is_package && (
                      <span className="absolute left-2 top-2 rounded-lg bg-pink-600 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                        Isi {product.package_size} Pcs
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-1 flex-col justify-between space-y-2">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-gray-800">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-black text-pink-600">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>

                      <span className="rounded-lg bg-pink-50 px-2 py-1 text-[10px] font-bold text-pink-600 opacity-0 transition-opacity group-hover:opacity-100">
                        + Keranjang
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}