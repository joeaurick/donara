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

  promo_code?: string | null;

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
  const cartButton = document.getElementById(
    "mobile-cart-button"
  );

  if (!cartButton) return;

  const sourceRect =
    sourceElement.getBoundingClientRect();

  const targetRect =
    cartButton.getBoundingClientRect();

  const clone =
    sourceElement.cloneNode(true) as HTMLElement;

  clone.style.position = "fixed";
  clone.style.left = `${sourceRect.left}px`;
  clone.style.top = `${sourceRect.top}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.zIndex = "9999";
  clone.style.pointerEvents = "none";
  clone.style.borderRadius = "24px";
  clone.style.overflow = "hidden";
  clone.style.transition =
    "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease";

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    const translateX =
      targetRect.left +
      targetRect.width / 2 -
      (sourceRect.left +
        sourceRect.width / 2);

    const translateY =
      targetRect.top +
      targetRect.height / 2 -
      (sourceRect.top +
        sourceRect.height / 2);

    clone.style.transform = `
      translate(${translateX}px, ${translateY}px)
      scale(0.12)
    `;

    clone.style.opacity = "0.15";
  });

  setTimeout(() => {
    clone.remove();

    cartButton.classList.add(
      "cart-bounce"
    );

    setTimeout(() => {
      cartButton.classList.remove(
        "cart-bounce"
      );
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
    (
      acc: { [key: string]: Product[] },
      product
    ) => {
      const cat =
        product.category || "Lainnya";

      if (!acc[cat]) {
        acc[cat] = [];
      }

      acc[cat].push(product);

      return acc;
    },
    {}
  );

  return (
    <div className="space-y-7 pb-4">
      {Object.entries(categories).map(
        ([categoryName, items], categoryIndex) => (
          <section
            key={categoryName}
            className="space-y-4"
          >
            {/* CATEGORY HEADER */}
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-[10px] font-black text-pink-500 ring-1 ring-pink-100">
                {String(
                  categoryIndex + 1
                ).padStart(2, "0")}
              </span>

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-pink-400">
                    Kategori Menu
                  </p>

                  <h2 className="mt-0.5 text-sm font-black capitalize tracking-tight text-slate-800">
                    {categoryName}
                  </h2>
                </div>

                <div className="mt-4 h-px flex-1 bg-pink-100" />
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:gap-4">
              {items.map((product) => {
                const finalImageUrl =
                  product.image_url ||
                  product.image;

                const handleItemClick = (
                  e: React.MouseEvent<HTMLButtonElement>
                ) => {
                  animateToCart(
                    e.currentTarget
                  );

                  setTimeout(() => {
                    if (
                      product.is_package
                    ) {
                      onPackageClick(
                        product
                      );
                    } else {
                      onProductClick(
                        product
                      );
                    }
                  }, 120);
                };

                return (
                  <motion.button
                    key={product.id}
                    type="button"
                    onClick={handleItemClick}
                    whileTap={{
                      scale: 0.96,
                    }}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.22,
                    }}
                    className="group relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-pink-100/80 bg-white p-2.5 text-left shadow-[0_8px_24px_rgba(45,27,22,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_14px_30px_rgba(236,72,153,0.12)]"
                  >
                    {/* SOFT HOVER OVERLAY */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-50/0 via-pink-50/0 to-pink-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* IMAGE */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-[17px] bg-[#fff8f7]">
                      {finalImageUrl ? (
                        <Image
                          src={finalImageUrl}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-pink-50/60">
                          <span className="text-lg">
                            🍩
                          </span>

                          <span className="text-[8px] font-bold text-pink-300">
                            No Image
                          </span>
                        </div>
                      )}

                      {/* PACKAGE BADGE */}
                      {product.is_package && (
                        <span className="absolute left-2 top-2 rounded-lg bg-pink-500 px-2 py-1 text-[8px] font-black uppercase tracking-[0.08em] text-white shadow-[0_4px_10px_rgba(236,72,153,0.25)]">
                          Paket
                        </span>
                      )}

                      {/* PACKAGE SIZE */}
                      {product.is_package &&
                        product.package_size && (
                          <span className="absolute bottom-2 right-2 rounded-lg bg-white/90 px-2 py-1 text-[8px] font-black text-pink-500 shadow-sm backdrop-blur-sm">
                            {product.package_size} Pcs
                          </span>
                        )}
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10 flex min-h-[72px] flex-1 flex-col justify-between px-1 pb-1 pt-3">
                      <div>
                        <h3 className="line-clamp-2 text-[11px] font-black leading-[1.35] text-slate-800 sm:text-xs">
                          {product.name}
                        </h3>
                      </div>

                      <div className="mt-2 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                            Harga
                          </p>

                          <span className="mt-0.5 block text-[11px] font-black tracking-tight text-pink-600 sm:text-xs">
                            Rp{" "}
                            {product.price.toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>

                        {/* ADD BUTTON */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-sm font-black text-pink-500 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-pink-200">
                          +
                        </span>
                      </div>
                    </div>

                    {/* TAP EFFECT */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 rounded-[22px] border-2 border-pink-300 opacity-0"
                      whileTap={{
                        opacity: [
                          0,
                          0.35,
                          0,
                        ],
                        scale: [
                          1,
                          1.03,
                          1.06,
                        ],
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                    />
                  </motion.button>
                );
              })}
            </div>
          </section>
        )
      )}
    </div>
  );
}