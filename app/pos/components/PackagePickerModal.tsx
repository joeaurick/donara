"use client";

type Product = {
  id: number;
  name: string;
};

type PackageProduct = {
  id: number;
  name: string;
  qty: number;
};

type Props = {
  open: boolean;
  title: string;
  maxSelect: number;

  products: Product[];

  selected: PackageProduct[];

  onIncrease: (product: Product) => void;

  onDecrease: (product: Product) => void;

  onClose: () => void;

  onSave: () => void;
};

export default function PackagePickerModal({
  open,
  title,
  maxSelect,
  products,
  selected,
  onIncrease,
  onDecrease,
  onClose,
  onSave,
}: Props) {
  if (!open) return null;

  const total = selected.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  function qty(id: number) {
    return (
      selected.find((x) => x.id === id)?.qty ?? 0
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white">

        <div className="border-b p-6">

          <h2 className="text-2xl font-black">
            {title}
          </h2>

          <p className="mt-1 text-gray-500">
            Pilih {maxSelect} Donat
          </p>

          <div className="mt-4">

            <span className="rounded-lg bg-pink-100 px-3 py-2 font-bold text-pink-600">
              {total} / {maxSelect}
            </span>

          </div>

        </div>

        <div className="flex-1 overflow-y-auto p-6">

          <div className="space-y-3">

            {products.map((product) => (

              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >

                <div>

                  <h3 className="font-bold">
                    {product.name}
                  </h3>

                </div>

                <div className="flex items-center gap-3">

                  <button
                    onClick={() =>
                      onDecrease(product)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-xl font-bold"
                  >
                    −
                  </button>

                  <span className="w-8 text-center text-lg font-black">
                    {qty(product.id)}
                  </span>

                  <button
                    disabled={total >= maxSelect}
                    onClick={() =>
                      onIncrease(product)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-600 text-xl font-bold text-white disabled:bg-gray-300"
                  >
                    +
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3 font-bold"
          >
            Batal
          </button>

          <button
            disabled={total !== maxSelect}
            onClick={onSave}
            className="rounded-xl bg-pink-600 px-6 py-3 font-bold text-white disabled:bg-gray-300"
          >
            Tambah Paket
          </button>

        </div>

      </div>

    </div>
  );
}