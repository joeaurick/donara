"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getGallery } from "@/lib/supabase/gallery";

type GalleryItem = {
  id: number;
  image: string;
};

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    const data = await getGallery();
    setImages(data);
  }

  return (
    <section
      id="gallery"
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-10 h-64 w-64 rounded-full bg-pink-100/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-orange-100/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/90 px-4 py-2 text-xs font-semibold text-pink-600 shadow-sm backdrop-blur sm:px-5 sm:text-sm">
            <span>📸</span>
            <span>Gallery</span>
          </span>

          <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Momen Lezat Donara
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Lihat berbagai varian donat premium Donara yang dibuat fresh setiap
            hari dengan tampilan yang menggugah selera dan siap menemani momen
            spesial Anda.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {images.length === 0 ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-3xl bg-pink-100/60"
              />
            ))
          ) : (
            images.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelected(item.image)}
                className={`group relative overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  index % 5 === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt="Gallery Donara"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                      <span>🔍</span>
                      <span>Lihat Foto</span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6">
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-300 hover:bg-white/20 sm:right-6 sm:top-6 sm:h-12 sm:w-12"
            aria-label="Tutup gallery"
          >
            <X size={22} />
          </button>

          <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
            <Image
              src={selected}
              alt="Gallery Donara"
              width={1200}
              height={1200}
              className="h-auto max-h-[85vh] w-full object-contain"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}