type Props = {
  saving: boolean;
  onSave: () => void;
};

export default function SaveHomepageButton({
  saving,
  onSave,
}: Props) {
  return (
    <div className="sticky bottom-4 z-20 mt-8">
      <div className="rounded-3xl border border-white/70 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900">
              Simpan Perubahan Homepage
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Pastikan seluruh konten sudah diperiksa sebelum dipublikasikan.
            </p>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-pink-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-pink-700 hover:to-rose-600 hover:shadow-xl hover:shadow-pink-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
          >
            {saving ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span className="text-base">💾</span>
                <span>Simpan Homepage</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}