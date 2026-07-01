"use client";

import Image from "next/image";

type Props = {
  title: string;
  description: string;
  favicon?: string;
  canonicalUrl?: string;
};

export default function SeoPreview({
  title,
  description,
  favicon,
  canonicalUrl,
}: Props) {
  const website = canonicalUrl || "https://donara.com";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">

      <div className="mb-6">

        <h2 className="text-3xl font-black text-pink-600">
          🔍 Google Search Preview
        </h2>

        <p className="mt-2 text-gray-500">
          Preview bagaimana website muncul di hasil pencarian Google.
        </p>

      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">

        {/* Header */}

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-white">

            {favicon ? (
              <Image
                src={favicon}
                alt="Favicon"
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-pink-600">
                D
              </span>
            )}

          </div>

          <div>

            <p className="text-sm font-medium text-gray-900">
              {title || "Donara"}
            </p>

            <p className="text-xs text-green-700">
              {website}
            </p>

          </div>

        </div>

        {/* Title */}

        <h3 className="mt-5 cursor-default text-2xl text-blue-700 hover:underline">

          {title || "Website Title"}

        </h3>

        {/* Description */}

        <p className="mt-3 leading-7 text-gray-700">

          {description ||
            "Meta description akan tampil di sini ketika pengguna mencari website Anda di Google."}

        </p>

      </div>

      {/* SEO Tips */}

      <div className="mt-6 rounded-xl bg-blue-50 p-4">

        <h4 className="font-bold text-blue-700">
          Tips SEO
        </h4>

        <ul className="mt-3 space-y-2 text-sm text-gray-600">

          <li>
            • Website Title ideal antara <b>50–60 karakter</b>.
          </li>

          <li>
            • Meta Description ideal antara <b>150–160 karakter</b>.
          </li>

          <li>
            • Gunakan keyword utama di awal judul.
          </li>

          <li>
            • Hindari keyword yang berulang.
          </li>

          <li>
            • Upload favicon minimal <b>48×48 px</b>.
          </li>

        </ul>

      </div>

    </div>
  );
}