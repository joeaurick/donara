"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function UploadQrisPage() {
  const params = useParams();
  const router = useRouter();

  const [uploading, setUploading] =
    useState(false);

  async function handleFile(
    file: File
  ) {
    try {
      setUploading(true);

      const transactionId =
        params.id as string;

      const ext =
        file.name.split(".").pop() ||
        "jpg";

      const fileName = `${transactionId}-${Date.now()}.${ext}`;

      // Upload
      const { error: uploadError } =
        await supabase.storage
          .from("qris-proofs")
          .upload(fileName, file, {
            upsert: true,
          });

      if (uploadError) {
        throw uploadError;
      }

      // Public URL
      const { data } = supabase.storage
        .from("qris-proofs")
        .getPublicUrl(fileName);

      // Simpan ke transaksi
      const { error: updateError } =
        await supabase
          .from("transactions")
          .update({
            qris_proof_url:
              data.publicUrl,
          })
          .eq("id", transactionId);

      if (updateError) {
        throw updateError;
      }

      alert(
        "Bukti QRIS berhasil disimpan"
      );

      router.push("/pos/history");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-black text-slate-900">
          Upload Bukti QRIS
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Pilih foto bukti pembayaran untuk transaksi ini.
        </p>

        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center hover:border-pink-400 hover:bg-pink-50">
          <span className="text-3xl">📷</span>

          <span className="mt-2 text-sm font-bold text-slate-700">
            {uploading
              ? "Mengupload..."
              : "Pilih Foto Bukti QRIS"}
          </span>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (file) {
                handleFile(file);
              }
            }}
          />
        </label>
      </div>
    </main>
  );
}