"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { createTransaction } from "@/lib/supabase/transactions";
import { getNextInvoice } from "@/lib/supabase/invoice";
import { decreaseTodayStock } from "@/lib/supabase/daily-stock";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PaymentModal({
  open,
  onClose,
}: Props) {
  const {
  total,
  subtotal,
  discount,
  tax,
  cart,
  clear,
} = useCart();

  const [method, setMethod] = useState("Cash");
  const [paid, setPaid] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (method === "Cash") {
      setPaid(0);
    } else {
      setPaid(total);
    }
  }, [method, total, open]);

  if (!open) return null;

  const change =
    method === "Cash"
      ? Math.max(0, paid - total)
      : 0;

  const quickMoney = (value: number) => {
    setPaid(value);
  };

  async function handlePayment() {
  try {
    setLoading(true);

    console.log("1");

    const invoice = await getNextInvoice();

    console.log("2");

    await createTransaction({
      invoice,
      paymentMethod: method,
      subtotal,
      discount,
      tax,
      total,
      paid: method === "Cash" ? paid : total,
      change,
      items: cart,
    });

    console.log("3");

    let totalQty = 0;

for (const item of cart) {
  if (!item.isPackage) {
    totalQty += item.qty;
    continue;
  }

  for (const donut of item.packageProducts ?? []) {
    totalQty += donut.qty * item.qty;
  }
}

await decreaseTodayStock(totalQty);

// Beri tahu dashboard bahwa stok berubah
window.dispatchEvent(new Event("stock-updated"));

clear();

onClose();

alert("Pembayaran berhasil.");
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3">

  <div className="flex h-[95vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="shrink-0 border-b bg-white px-6 py-5">

  <p className="text-sm text-gray-500">
    Total Pembayaran
  </p>

  <h1 className="mt-2 text-4xl font-black text-pink-600">
    Rp {total.toLocaleString("id-ID")}
  </h1>

</div>

        {/* Content */}

        <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-6">

          {/* Payment */}

          <div>

            <label className="mb-3 block font-bold">
              Metode Pembayaran
            </label>

            <div className="grid grid-cols-3 gap-3">

              <button
                onClick={() => setMethod("Cash")}
                className={`rounded-2xl border p-4 font-bold transition ${
                  method === "Cash"
                    ? "border-green-600 bg-green-600 text-white"
                    : ""
                }`}
              >
                💵
                <br />
                Cash
              </button>

              <button
                onClick={() => setMethod("QRIS")}
                className={`rounded-2xl border p-4 font-bold transition ${
                  method === "QRIS"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : ""
                }`}
              >
                📱
                <br />
                QRIS
              </button>

              <button
                onClick={() => setMethod("Transfer")}
                className={`rounded-2xl border p-4 font-bold transition ${
                  method === "Transfer"
                    ? "border-purple-600 bg-purple-600 text-white"
                    : ""
                }`}
              >
                🏦
                <br />
                Transfer
              </button>

            </div>

          </div>

          {/* CASH */}

          {method === "Cash" && (

            <>

              <div>

                <label className="mb-2 block font-bold">
                  Nominal Dibayar
                </label>

                <input
                  type="number"
                  value={paid}
                  onChange={(e) =>
                    setPaid(Number(e.target.value))
                  }
                  className="w-full rounded-2xl border p-4 text-xl font-bold"
                />

              </div>

              <button
                onClick={() => setPaid(total)}
                className="w-full rounded-2xl border py-4 font-bold hover:bg-gray-100"
              >
                ✓ Uang Pas
              </button>

              <div className="grid grid-cols-3 gap-3">

                {[20000, 50000, 100000].map((value) => (

                  <button
                    key={value}
                    onClick={() => quickMoney(value)}
                    className="rounded-2xl bg-gray-100 py-4 font-bold hover:bg-gray-200"
                  >
                    {value / 1000}K
                  </button>

                ))}

              </div>

            </>

          )}

          {/* NON CASH */}

          {method !== "Cash" && (

            <div className="rounded-2xl bg-gray-100 p-5 text-center">

              <p className="text-gray-500">
                Nominal Pembayaran
              </p>

              <p className="mt-2 text-3xl font-black">
                Rp {total.toLocaleString("id-ID")}
              </p>

            </div>

          )}

          {/* SUMMARY */}

          <div className="rounded-2xl bg-gray-50 p-5">

            <div className="mb-2 flex justify-between">

              <span>Total Item</span>

              <span>{cart.length}</span>

            </div>

            <div className="flex justify-between text-xl font-black">

              <span>Kembalian</span>

              <span className="text-green-600">
                Rp {change.toLocaleString("id-ID")}
              </span>

            </div>

          </div>

          {/* FOOTER */}

          <div className="shrink-0 border-t bg-white p-5">

  <div className="flex gap-3">

    <button
      onClick={onClose}
      className="flex-1 rounded-2xl border py-4 font-bold"
    >
      Batal
    </button>

    <button
  onClick={handlePayment}
  disabled={
    loading ||
    cart.length === 0 ||
    (method === "Cash" && paid < total)
  }
  className="flex-[2] rounded-2xl bg-pink-600 py-4 text-lg font-black text-white disabled:bg-gray-300"
>
      {loading
  ? "Menyimpan..."
  : `Bayar Rp ${total.toLocaleString("id-ID")}`}
    </button>

  </div>

</div>

        </div>

      </div>

    </div>
  );
}