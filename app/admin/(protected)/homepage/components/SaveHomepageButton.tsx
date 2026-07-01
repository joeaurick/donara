type Props = {
  saving: boolean;
  onSave: () => void;
};

export default function SaveHomepageButton({
  saving,
  onSave,
}: Props) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="mt-10 w-full rounded-full bg-pink-600 py-5 text-xl font-bold text-white transition hover:bg-pink-700 disabled:opacity-50"
    >
      {saving
        ? "Menyimpan..."
        : "💾 Simpan Homepage"}
    </button>
  );
}