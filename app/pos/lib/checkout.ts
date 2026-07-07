import { supabase } from "@/lib/supabase/client";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

type CheckoutData = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paid: number;
  change: number;
  cashierId: string;
};

export async function checkout(data: CheckoutData) {
  const invoice =
    "INV-" +
    Date.now().toString();

  const { data: transaction, error } =
    await supabase
      .from("pos_transactions")
      .insert({
        invoice,
        cashier_id: data.cashierId,
        subtotal: data.subtotal,
        discount: data.discount,
        tax: data.tax,
        total: data.total,
        payment_method: data.paymentMethod,
        paid: data.paid,
        change: data.change,
      })
      .select()
      .maybeSingle();

  if (error) throw error;

  const details = data.items.map((item) => ({
    transaction_id: transaction.id,
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    qty: item.qty,
    subtotal: item.price * item.qty,
  }));

  const { error: itemError } =
    await supabase
      .from("pos_transaction_items")
      .insert(details);

  if (itemError) throw itemError;

  return transaction;
}