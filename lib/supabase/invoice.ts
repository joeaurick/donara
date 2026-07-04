import { supabase } from "./client";
import { generateInvoice } from "../invoice";

export async function getNextInvoice() {
  const { data } = await supabase
    .from("transactions")
    .select("invoice")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  let last = 0;

  if (data?.invoice) {
    const split = data.invoice.split("-");
    last = Number(split[2]);
  }

  return generateInvoice(last);
}