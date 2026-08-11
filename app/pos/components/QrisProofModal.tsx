"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  transactionId: string;
  onClose: () => void;
};

export default function QrisProofModal({
  transactionId,
  onClose,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] =
    useState(false);

  async function handleUpload(file: File) {
    try {
      setUploading(true);

      if (!transactionId) {
        alert(
          "Transaction ID tidak ditemukan"
        );
        return;
      }

      const ext =
        file.name.split(".").pop() || "jpg";

      const fileName = `${transactionId}-${Date.now()}.${ext}`;

      // Upload ke Supabase Storage
      const { error: uploadError } =
        await supabase.storage
          .from("qris-proofs")
          .upload(fileName, file, {
            upsert: true,
          });

      if (uploadError) {
        console.error(uploadError);
        alert(
          "Upload gagal: " +
            uploadError.message
        );
        return;
      }

      // Ambil public URL
      const { data } = supabase.storage
        .from("qris-proofs")
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      // Simpan URL ke tabel transactions
      const { error: updateError } =
        await supabase
          .from("transactions")
          .update({
            qris_proof_url: publicUrl,
          })
          .eq("id", transactionId);

      if (updateError) {
        console.error(updateError);
        alert(
          "Gagal menyimpan bukti QRIS"
        );
        return;
      }

      alert(
        "Bukti QRIS berhasil disimpan"
      );

      onClose();
    } catch (err) {
      console.error(err);

      alert("Terjadi kesalahan upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-black text-slate-900">
          Upload Bukti QRIS
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Ambil foto atau pilih gambar bukti pembayaran QRIS.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            disabled={uploading}
            className="w-full rounded-2xl bg-pink-600 px-4 py-3 text-sm font-black text-white transition hover:bg-pink-700 disabled:opacity-50"
          >
            {uploading
              ? "Mengupload..."
              : "📷 Ambil Foto / Pilih Galeri"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Nanti Saja
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (file) {
              handleUpload(file);
            }
          }}
        />
      </div>
    </div>
  );
}