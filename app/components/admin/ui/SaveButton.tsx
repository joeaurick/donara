"use client";

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
    <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">

      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-pink-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          shadow-md
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-pink-700
          hover:shadow-lg
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                opacity=".25"
              />
              <path
                d="M22 12A10 10 0 0012 2"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            Menyimpan...
          </>
        ) : (
          <>
            <span>💾</span>
            {text}
          </>
        )}
      </button>

    </div>
  );
}