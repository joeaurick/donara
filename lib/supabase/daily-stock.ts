import { supabase } from "./client";

export async function getTodayStock() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", today)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveTodayStock(stock: number) {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("daily_stock")
    .upsert(
      {
        stock_date: today,
        opening_stock: stock,
        remaining_stock: stock,
      },
      {
        onConflict: "stock_date",
      }
    );

  if (error) throw error;
}

export async function decreaseTodayStock(qty: number) {
  const today = new Date().toISOString().split("T")[0];
console.log("TODAY =", today);
  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", today)
    .maybeSingle();

  if (error) throw error;

  // Jika stok hari ini belum dibuat, hentikan proses
  if (!data) {
    throw new Error(
      "Stok hari ini belum diisi. Silakan isi stok terlebih dahulu."
    );
  }

  

  const remain = Math.max(0, data.remaining_stock - qty);

  const { error: updateError } = await supabase
    .from("daily_stock")
    .update({
      remaining_stock: remain,
    })
    .eq("id", data.id);

  if (updateError) throw updateError;
}

export async function refreshTodayStock() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const date = `${year}-${month}-${day}`;

  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", date)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function closeTodayStock() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const date = `${year}-${month}-${day}`;

  const { error } = await supabase
    .from("daily_stock")
    .update({
      is_closed: true,
    })
    .eq("stock_date", date);

  if (error) throw error;
}

export async function isTodayClosed() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const date = `${year}-${month}-${day}`;

  const { data, error } = await supabase
    .from("daily_stock")
    .select("is_closed")
    .eq("stock_date", date)
    .maybeSingle();

  if (error) throw error;

  return data?.is_closed ?? false;
}