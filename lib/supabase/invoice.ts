import { supabase } from "./client";
import { generateInvoice } from "../invoice";

export async function getNextInvoice() {
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const prefix = `INV-${yyyy}${mm}${dd}-`;

  const { data, error } = await supabase
    .from("transactions")
    .select("invoice")
    .like("invoice", `${prefix}%`)
    .order("invoice", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  let lastNumber = 0;

  if (data?.invoice) {
    const match = data.invoice.match(/(\d+)$/);

    if (match) {
      lastNumber = parseInt(match[1], 10);
    }
  }

  return generateInvoice(lastNumber);
}