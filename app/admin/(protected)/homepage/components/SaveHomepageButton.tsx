import { LoaderCircle, Save } from "lucide-react";

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
      <div className="rounded-[26px] border border-emerald-100 bg-white/95 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Save className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-black text-slate-900">
                Simpan perubahan homepage
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Periksa kembali semua konten sebelum menyimpan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 text-sm font-black text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[210px]"
          >
            {saving ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Homepage
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}