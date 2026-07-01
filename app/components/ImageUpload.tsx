"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export default function ImageUpload({
  value,
  onChange,
}: Props) {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("❌ File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    // Validasi ukuran
    if (file.size > MAX_SIZE) {
      alert("❌ Ukuran gambar maksimal 2 MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const safeName = file.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      const fileName = `${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      // Cache busting supaya preview langsung berubah
      onChange(`${data.publicUrl}?v=${Date.now()}`);

      // Supaya file yang sama bisa dipilih lagi
      e.target.value = "";
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat upload gambar."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">

      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={uploadImage}
        className="w-full rounded-xl border border-gray-300 bg-white p-3 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {uploading && (
        <div className="rounded-xl bg-pink-50 p-3 text-sm font-semibold text-pink-600">
          ⏳ Sedang mengupload gambar...
        </div>
      )}

      {value && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <Image
            src={value}
            alt="Preview"
            width={600}
            height={400}
            unoptimized
            className="h-48 w-full object-contain bg-gray-50"
          />

          <div className="border-t bg-gray-50 p-3 text-xs text-gray-500 break-all">
            {value}
          </div>
        </div>
      )}

    </div>
  );
}