import { supabase } from "./client";

export async function getTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      transaction_items (
        product_name,
        qty,
        price,
        subtotal
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}