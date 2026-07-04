"use client";

import { useCart } from "../context/CartContext";
import CartSummary from "./CartSummary";

export default function CartPanel() {
  const {
    cart,
    increase,
    decrease,
    remove,
  } = useCart();

  // 🚨 TAMBAHAN SAFETY FLAG
  // nanti dihubungkan dari POS page
  const todayClosed = false;

  const totalItem = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  function blockIfClosed() {
    if (todayClosed) {
      alert("Toko sudah tutup. Transaksi tidak bisa dilakukan.");
      return true;
    }
    return false;
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">

      <div className="border-b px-5 py-2 text-right">
        <span className="text-xs text-gray-500">
          {totalItem} Item
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">

        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="text-7xl">🛒</div>

            <p className="mt-6 text-lg font-bold text-gray-700">
              Keranjang masih kosong
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Pilih produk dari sebelah kiri
            </p>
          </div>
        ) : (
          <div className="space-y-3 p-4">

            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate font-bold">
                      {item.name}

                      {item.isPackage && (
                        <span className="ml-2 rounded bg-pink-100 px-2 py-1 text-xs font-bold text-pink-600">
                          PAKET
                        </span>
                      )}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Rp {item.price.toLocaleString("id-ID")} × {item.qty}
                    </p>

                    {item.isPackage &&
                      item.packageProducts &&
                      item.packageProducts.length > 0 && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          {item.packageProducts.map((p) => (
                            <div
                              key={p.id}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span>• {p.name}</span>
                              <span>x{p.qty}</span>
                            </div>
                          ))}
                        </div>
                      )}

                  </div>

                  <div className="text-right">
                    <p className="font-black text-pink-600">
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </p>
                  </div>

                </div>

                <div className="mt-3 flex items-center gap-2">

                  <button
                    onClick={() => {
                      if (blockIfClosed()) return;
                      decrease(item.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 font-bold"
                  >
                    −
                  </button>

                  <span className="w-8 text-center font-bold">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => {
                      if (blockIfClosed()) return;
                      increase(item.id);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-600 font-bold text-white"
                  >
                    +
                  </button>

                  <button
                    onClick={() => {
                      if (blockIfClosed()) return;
                      remove(item.id);
                    }}
                    className="ml-auto rounded-lg px-3 py-1 text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    🗑
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      <div className="border-t">
        <CartSummary />
      </div>

    </div>
  );
}