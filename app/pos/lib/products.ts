import { supabase } from "@/lib/supabase/client";
import { PosProduct } from "../types/product";

export async function getProducts(): Promise<PosProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}