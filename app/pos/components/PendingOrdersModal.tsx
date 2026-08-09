"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "../context/CartContext";

type OrderItem = {
  product_name: string;
  qty: number;
  price: number;
  promo_code?: string | null;
};

type PendingOrder = {
  id: string;
  order_number: string;
  subtotal: number;
  created_at: string;
  pending_order_items: OrderItem[];
};

export default function PendingOrdersModal() {
  const { addToCart, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadOrders() {
    setLoading(true);

    const { data, error } = await supabase
  .from("pending_orders")
  .select(
    `
      id,
      order_number,
      subtotal,
      created_at,
      pending_order_items (
        product_id,
        product_name,
        qty,
        price,
        promo_code
      )
    `
  )
  .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as PendingOrder[]);
    }

    setLoading(false);
  }

  async function deleteOrder(id: string) {
    if (!confirm("Hapus pesanan ini?")) return;

    const { error } = await supabase
      .from("pending_orders")
      .delete()
      .eq("id", id);

    if (!error) {
      loadOrders();
    }
  }

  async function resumeOrder(order: any) {
  try {
    // kirim item ke keranjang
    window.dispatchEvent(
      new CustomEvent("resume-pending-order", {
        detail: order,
      })
    );

    // ⬇️ HAPUS DARI PENDING LIST
    const { error } = await supabase
      .from("pending_orders")
      .delete()
      .eq("id", order.id);

    if (error) {
      console.error(error);
    }

    // refresh daftar pending
    await loadOrders();

    // tutup modal
    setOpen(false);
  } catch (err) {
    console.error(err);
    alert("Gagal melanjutkan pesanan.");
  }
}

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      loadOrders();
    };

    window.addEventListener(
      "open-pending-orders",
      handler
    );

    return () =>
      window.removeEventListener(
        "open-pending-orders",
        handler
      );
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div>
            <h2 className="text-lg font-black text-gray-800">
              📋 Pesanan Ditahan
            </h2>
            <p className="text-xs text-gray-500">
              Daftar pesanan pelanggan yang belum dibayar
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="h-[calc(100%-72px)] overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-gray-400">
              Memuat pesanan...
            </p>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
              Belum ada pesanan ditahan.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-gray-800">
                        {order.order_number}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    <span className="text-sm font-black text-pink-600">
                      Rp {Number(order.subtotal).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="space-y-2 rounded-xl bg-gray-50 p-3">
                    {order.pending_order_items?.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-gray-700">
                            • {item.product_name} x{item.qty}
                          </span>

                          <span className="font-bold text-gray-800">
                            Rp {(item.price * item.qty).toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
  type="button"
  onClick={() => resumeOrder(order)}
  className="flex-1 rounded-xl border border-pink-200 bg-pink-50 py-2 text-xs font-black text-pink-700 hover:bg-pink-100"
>
  💳 Lanjutkan
</button>

                    <button
                      type="button"
                      onClick={() => deleteOrder(order.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}