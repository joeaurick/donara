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
      className="bg-[#FFF8F3] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-pink-100 px-5 py-2 text-sm font-semibold text-pink-600">
            Gallery
          </span>

          <h2 className="mt-6 text-5xl font-black text-[#2F2F2F]">
            Momen Lezat Donara
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Lihat berbagai varian donat premium Donara yang dibuat fresh
            setiap hari.
          </p>

        </div>

        <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-3">

          {images.map((item) => (

            <button
              key={item.id}
              onClick={() => setSelected(item.image)}
              className="group overflow-hidden rounded-3xl"
            >

              <Image
                src={item.image}
                alt="Gallery Donara"
                width={600}
                height={600}
                className="aspect-square object-cover transition duration-500 group-hover:scale-110"
              />

            </button>

          ))}

        </div>

      </div>

      {selected && (

        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-5">

          <button
            onClick={() => setSelected(null)}
            className="absolute right-8 top-8 text-white"
          >
            <X size={36} />
          </button>

          <Image
            src={selected}
            alt="Gallery"
            width={900}
            height={900}
            className="max-h-[90vh] w-auto rounded-3xl"
          />

        </div>

      )}

    </section>
  );
}