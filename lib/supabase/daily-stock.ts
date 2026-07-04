import { supabase } from "./client";

// =========================
// UTIL DATE
// =========================
function getToday() {
  return new Date().toISOString().split("T")[0];
}

// =========================
// GET STOCK
// =========================
export async function getTodayStock() {
  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", getToday())
    .maybeSingle();

  if (error) throw error;
  return data;
}

// =========================
// SAVE / OPEN DAY (FIX RLS SAFE)
// =========================
export async function saveTodayStock(stock: number) {
  const today = getToday();

  // 1. cek dulu
  const { data } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", today)
    .maybeSingle();

  // 2. kalau ada → UPDATE
  if (data) {
    const { error } = await supabase
      .from("daily_stock")
      .update({
        opening_stock: stock,
        remaining_stock: stock,
        is_closed: false,
      })
      .eq("id", data.id);

    if (error) throw error;
    return;
  }

  // 3. kalau belum ada → INSERT (ini yang tadi kena RLS)
  const { error } = await supabase.from("daily_stock").insert({
    stock_date: today,
    opening_stock: stock,
    remaining_stock: stock,
    is_closed: false,
  });

  if (error) throw error;
}

// =========================
// DECREASE STOCK
// =========================
export async function decreaseTodayStock(qty: number) {
  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", getToday())
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Stock belum dibuat");

  const remain = Math.max(0, data.remaining_stock - qty);

  const { error: updateError } = await supabase
    .from("daily_stock")
    .update({ remaining_stock: remain })
    .eq("id", data.id);

  if (updateError) throw updateError;
}

// =========================
// CLOSE DAY (FIX + SIMPLE)
// =========================
export async function closeTodayStock() {
  const { error } = await supabase
    .from("daily_stock")
    .update({ is_closed: true })
    .eq("stock_date", getToday());

  if (error) throw error;
}

// =========================
// CHECK CLOSED
// =========================
export async function isTodayClosed() {
  const { data } = await supabase
    .from("daily_stock")
    .select("is_closed")
    .eq("stock_date", getToday())
    .maybeSingle();

  return data?.is_closed ?? false;
}

// =========================
// REFRESH
// =========================
export async function refreshTodayStock() {
  const { data } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", getToday())
    .maybeSingle();

  return data;
}