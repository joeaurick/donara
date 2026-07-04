import { supabase } from "./client";

// =========================
// GET STATUS TOKO
// =========================
export async function getStoreStatus() {
  const { data, error } = await supabase
    .from("store_status")
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// =========================
// CEK APA TOKO TUTUP
// =========================
export async function isStoreClosed() {
  const { data } = await supabase
    .from("store_status")
    .select("is_open")
    .single();

  return data ? !data.is_open : true;
}

// =========================
// TUTUP TOKO (ADMIN ONLY LATER)
// =========================
export async function closeStore() {
  const { error } = await supabase
    .from("store_status")
    .update({ is_open: false })
    .eq("id", 1);

  if (error) throw error;
}

// =========================
// BUKA TOKO
// =========================
export async function openStore() {
  const { error } = await supabase
    .from("store_status")
    .update({ is_open: true })
    .eq("id", 1);

  if (error) throw error;
}