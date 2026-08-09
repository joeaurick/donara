import { supabase } from "@/lib/supabase/client";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  promo_code?: string | null;
};

export async function savePendingOrder(
  items: CartItem[],
  subtotal: number
) {
  const orderNumber = `P-${Date.now()
    .toString()
    .slice(-6)}`;

  const { data: order, error: orderError } =
    await supabase
      .from("pending_orders")
      .insert({
        order_number: orderNumber,
        subtotal,
        source: "CASHIER",
      })
      .select()
      .single();

  if (orderError) throw orderError;

  const rows = items.map((item) => ({
    pending_order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    qty: item.qty,
    subtotal: item.price * item.qty,
    promo_code: item.promo_code ?? null,
  }));

  const { error: itemError } = await supabase
    .from("pending_order_items")
    .insert(rows);

  if (itemError) throw itemError;

  return order;
}