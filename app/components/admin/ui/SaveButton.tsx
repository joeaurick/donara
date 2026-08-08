"use client";

import { Loader2, Save } from "lucide-react";

type Props = {
  loading: boolean;
  onClick: () => void;
  text?: string;
};

export default function SaveButton({
  loading,
  onClick,
  text = "Simpan",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-lg sm:px-6 sm:text-[15px]"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          {text}
        </>
      )}
    </button>
  );
}