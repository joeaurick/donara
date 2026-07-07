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
// SAVE TODAY STOCK
// HANYA MEMBUAT DATA BARU
// TIDAK AKAN MEMBUKA TOKO LAGI
// =========================
export async function saveTodayStock(stock: number) {
  const today = getToday();

  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", today)
    .maybeSingle();

  if (error) throw error;

  // Kalau sudah ada data hari ini,
  // jangan diubah lagi.
  if (data) {
    return data;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("daily_stock")
    .insert({
      stock_date: today,
      opening_stock: stock,
      remaining_stock: stock,
      is_closed: false,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  return inserted;
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

  if (!data) {
    throw new Error("Stock belum dibuat.");
  }

  const remain = Math.max(
    0,
    Number(data.remaining_stock) - qty
  );

  const { error: updateError } = await supabase
    .from("daily_stock")
    .update({
      remaining_stock: remain,
    })
    .eq("id", data.id);

  if (updateError) throw updateError;
}

// =========================
// CLOSE DAY
// =========================
export async function closeTodayStock() {
  const { error } = await supabase
    .from("daily_stock")
    .update({
      is_closed: true,
    })
    .eq("stock_date", getToday());

  if (error) throw error;
}

// =========================
// CHECK CLOSED
// =========================
export async function isTodayClosed() {
  const { data, error } = await supabase
    .from("daily_stock")
    .select("is_closed")
    .eq("stock_date", getToday())
    .maybeSingle();

  if (error) throw error;

  return data?.is_closed ?? false;
}

// =========================
// REFRESH
// =========================
export async function refreshTodayStock() {
  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", getToday())
    .maybeSingle();

  if (error) throw error;

  return data;
}

// =========================
// CREATE OR UPDATE TODAY STOCK
// =========================
export async function saveOrUpdateTodayStock(stock: number) {
  const today = getToday();

  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", today)
    .maybeSingle();

  if (error) throw error;

  // BELUM ADA -> INSERT
  if (!data) {
    const { data: inserted, error: insertError } = await supabase
      .from("daily_stock")
      .insert({
        stock_date: today,
        opening_stock: stock,
        remaining_stock: stock,
        is_closed: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return inserted;
  }

  // SUDAH ADA -> UPDATE
  const currentSales =
    Number(data.opening_stock) - Number(data.remaining_stock);

  const newRemaining = Math.max(0, stock - currentSales);

  const { data: updated, error: updateError } = await supabase
    .from("daily_stock")
    .update({
      opening_stock: stock,
      remaining_stock: newRemaining,
    })
    .eq("id", data.id)
    .select()
    .single();

  if (updateError) throw updateError;

  return updated;
}