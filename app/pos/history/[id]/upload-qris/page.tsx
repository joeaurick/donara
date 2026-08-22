"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function UploadQrisPage() {
  const params = useParams();
  const router = useRouter();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    try {
      setUploading(true);

      const transactionId = params.id as string;

      const ext =
        file.name.split(".").pop() ||
        "jpg";

      const fileName =
        `${transactionId}-${Date.now()}.${ext}`;

      // Upload ke Supabase Storage
      const { error: uploadError } =
        await supabase.storage
          .from("qris-proofs")
          .upload(fileName, file, {
            upsert: true,
          });

      if (uploadError) {
        throw uploadError;
      }

      // Ambil Public URL
      const { data } = supabase.storage
        .from("qris-proofs")
        .getPublicUrl(fileName);

      // Simpan URL ke transaksi
      const { error: updateError } =
        await supabase
          .from("transactions")
          .update({
            qris_proof_url: data.publicUrl,
          })
          .eq("id", transactionId);

      if (updateError) {
        throw updateError;
      }

      alert("Bukti QRIS berhasil disimpan");

      router.push("/pos/history");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);

      // Reset input supaya file yang sama
      // tetap bisa dipilih kembali
      if (cameraInputRef.current) {
        cameraInputRef.current.value = "";
      }

      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    }
  }

  function handleCameraChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  function handleGalleryChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-2xl">
            📱
          </div>

          <h1 className="mt-4 text-xl font-black text-slate-900">
            Upload Bukti QRIS
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Tambahkan foto bukti pembayaran QRIS
            untuk transaksi ini.
          </p>
        </div>

        {/* Info */}
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs leading-5 text-blue-700">
            Pilih sumber foto yang ingin digunakan.
            Anda dapat mengambil foto baru atau
            memilih bukti pembayaran yang sudah
            tersimpan di perangkat.
          </p>
        </div>

        {/* Loading */}
        {uploading ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-pink-100 bg-pink-50 p-8 text-center">
            <div className="text-3xl">⏳</div>

            <p className="mt-3 text-sm font-bold text-pink-600">
              Mengupload bukti pembayaran...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Mohon tunggu sebentar
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Kamera */}
            <button
              type="button"
              onClick={() =>
                cameraInputRef.current?.click()
              }
              className="group flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-pink-300 hover:bg-pink-50 active:scale-[0.98]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-3xl transition group-hover:scale-105">
                📷
              </div>

              <span className="mt-3 text-sm font-black text-slate-900">
                Buka Kamera
              </span>

              <span className="mt-1 text-xs text-slate-500">
                Ambil foto baru
              </span>
            </button>

            {/* Galeri */}
            <button
              type="button"
              onClick={() =>
                galleryInputRef.current?.click()
              }
              className="group flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:border-pink-300 hover:bg-pink-50 active:scale-[0.98]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl transition group-hover:scale-105">
                🖼️
              </div>

              <span className="mt-3 text-sm font-black text-slate-900">
                Pilih dari Galeri
              </span>

              <span className="mt-1 text-xs text-slate-500">
                Foto dari perangkat
              </span>
            </button>
          </div>
        )}

        {/* Hidden input untuk Kamera */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={uploading}
          onChange={handleCameraChange}
        />

        {/* Hidden input untuk Galeri / File */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={handleGalleryChange}
        />

        {/* Kembali */}
        {!uploading && (
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 w-full rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Batal
          </button>
        )}
      </div>
    </main>
  );
}