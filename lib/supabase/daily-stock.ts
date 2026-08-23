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

  if (data) {
    return data;
  }

  const { data: inserted, error: insertError } =
    await supabase
      .from("daily_stock")
      .insert({
        stock_date: today,
        opening_stock: stock,
        remaining_stock: stock,
        self_consumed: 0,
        is_closed: false,
      })
      .select()
      .maybeSingle();

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

  const { error: updateError } =
    await supabase
      .from("daily_stock")
      .update({
        remaining_stock: remain,
      })
      .eq("id", data.id);

  if (updateError) throw updateError;
}

// =========================
// TAMBAH DONAT
// DIMAKAN SENDIRI
//
// Donat yang dimakan sendiri:
// 1. Menambah self_consumed
// 2. Mengurangi remaining_stock
// =========================
export async function addSelfConsumed(qty: number) {
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new Error(
      "Jumlah donat yang dimakan sendiri harus lebih dari 0."
    );
  }

  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", getToday())
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error(
      "Stock hari ini belum dibuat."
    );
  }

  if (data.is_closed) {
    throw new Error(
      "Toko hari ini sudah ditutup."
    );
  }

  const currentRemaining = Number(
    data.remaining_stock || 0
  );

  const currentSelfConsumed = Number(
    data.self_consumed || 0
  );

  if (qty > currentRemaining) {
    throw new Error(
      "Jumlah melebihi stok donat yang tersedia."
    );
  }

  const newRemaining =
    currentRemaining - qty;

  const newSelfConsumed =
    currentSelfConsumed + qty;

  const {
    data: updated,
    error: updateError,
  } = await supabase
    .from("daily_stock")
    .update({
      remaining_stock: newRemaining,
      self_consumed: newSelfConsumed,
    })
    .eq("id", data.id)
    .select()
    .maybeSingle();

  if (updateError) throw updateError;

  return updated;
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
export async function saveOrUpdateTodayStock(
  stock: number
) {
  const today = getToday();

  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", today)
    .maybeSingle();

  if (error) throw error;

  // =========================
  // BELUM ADA -> INSERT
  // =========================
  if (!data) {
    const {
      data: inserted,
      error: insertError,
    } = await supabase
      .from("daily_stock")
      .insert({
        stock_date: today,
        opening_stock: stock,
        remaining_stock: stock,
        self_consumed: 0,
        is_closed: false,
      })
      .select()
      .maybeSingle();

    if (insertError) throw insertError;

    return inserted;
  }

  // =========================
  // SUDAH ADA
  // PERTAHANKAN JUMLAH YANG
  // SUDAH KELUAR DARI STOK
  //
  // KELUAR = TERJUAL +
  // DIMAKAN SENDIRI
  // =========================
  const currentOutgoing =
    Number(data.opening_stock || 0) -
    Number(data.remaining_stock || 0);

  const newRemaining = Math.max(
    0,
    stock - currentOutgoing
  );

  const {
    data: updated,
    error: updateError,
  } = await supabase
    .from("daily_stock")
    .update({
      opening_stock: stock,
      remaining_stock: newRemaining,
    })
    .eq("id", data.id)
    .select()
    .maybeSingle();

  if (updateError) throw updateError;

  return updated;
}

// =========================
// SELF CONSUMED
// MAKAN SENDIRI
// =========================
export async function consumeTodayStock(
  qty: number
) {
  if (!qty || qty <= 0) {
    throw new Error(
      "Jumlah makan sendiri harus lebih dari 0."
    );
  }

  const { data, error } = await supabase
    .from("daily_stock")
    .select("*")
    .eq("stock_date", getToday())
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error(
      "Stok hari ini belum dibuat."
    );
  }

  if (data.is_closed) {
    throw new Error(
      "Toko hari ini sudah ditutup."
    );
  }

  const currentRemaining = Number(
    data.remaining_stock || 0
  );

  const currentConsumed = Number(
    data.self_consumed || 0
  );

  if (qty > currentRemaining) {
    throw new Error(
      "Jumlah melebihi stok yang tersedia."
    );
  }

  const newRemaining =
    currentRemaining - qty;

  const newConsumed =
    currentConsumed + qty;

  const {
    data: updated,
    error: updateError,
  } = await supabase
    .from("daily_stock")
    .update({
      remaining_stock: newRemaining,
      self_consumed: newConsumed,
    })
    .eq("id", data.id)
    .select()
    .maybeSingle();

  if (updateError) throw updateError;

  return updated;
}

// =========================
// STOCK REPORT FILTER
// =========================
export type StockReportFilter = {
  period?: "today" | "week" | "month";
  startDate?: string;
  endDate?: string;
};

function getStockDateRange(
  filter: StockReportFilter = {}
) {
  // =========================
  // FILTER TANGGAL MANUAL
  // =========================
  if (
    filter.startDate &&
    filter.endDate
  ) {
    return {
      startDate: filter.startDate,
      endDate: filter.endDate,
    };
  }

  const period = filter.period || "today";

  const today = new Date();

  // =========================
  // HARI INI
  // =========================
  if (period === "today") {
    const date = today
      .toISOString()
      .split("T")[0];

    return {
      startDate: date,
      endDate: date,
    };
  }

  // =========================
  // 7 HARI
  // =========================
  if (period === "week") {
    const start = new Date(today);

    start.setDate(
      start.getDate() - 6
    );

    return {
      startDate: start
        .toISOString()
        .split("T")[0],

      endDate: today
        .toISOString()
        .split("T")[0],
    };
  }

  // =========================
  // 30 HARI
  // =========================
  const start = new Date(today);

  start.setDate(
    start.getDate() - 29
  );

  return {
    startDate: start
      .toISOString()
      .split("T")[0],

    endDate: today
      .toISOString()
      .split("T")[0],
  };
}

// =========================
// GET STOCK REPORT
// BERDASARKAN PERIODE
// =========================
export async function getStockReport(
  filter: StockReportFilter = {}
) {
  const {
    startDate,
    endDate,
  } = getStockDateRange(filter);

  const {
    data,
    error,
  } = await supabase
    .from("daily_stock")
    .select("*")
    .gte("stock_date", startDate)
    .lte("stock_date", endDate)
    .order("stock_date", {
      ascending: true,
    });

  if (error) throw error;

  const stocks = data ?? [];

  // =========================
  // TOTAL STOK AWAL
  // =========================
  const openingStock =
    stocks.reduce(
      (sum, item) =>
        sum +
        Number(
          item.opening_stock || 0
        ),
      0
    );

  // =========================
  // TOTAL STOK TERSISA
  // =========================
  const remainingStock =
    stocks.reduce(
      (sum, item) =>
        sum +
        Number(
          item.remaining_stock || 0
        ),
      0
    );

  // =========================
  // TOTAL DIMAKAN SENDIRI
  // =========================
  const selfConsumed =
    stocks.reduce(
      (sum, item) =>
        sum +
        Number(
          item.self_consumed || 0
        ),
      0
    );

  // =========================
  // DONAT TERJUAL
  //
  // Rumus:
  //
  // opening
  // - remaining
  // - self consumed
  //
  // = benar-benar terjual
  // =========================
  const soldStock =
    stocks.reduce(
      (sum, item) => {
        const opening =
          Number(
            item.opening_stock || 0
          );

        const remaining =
          Number(
            item.remaining_stock || 0
          );

        const consumed =
          Number(
            item.self_consumed || 0
          );

        const sold = Math.max(
          0,
          opening -
            remaining -
            consumed
        );

        return sum + sold;
      },
      0
    );

  return {
    opening_stock: openingStock,

    remaining_stock:
      remainingStock,

    self_consumed:
      selfConsumed,

    sold_stock: soldStock,

    total_days: stocks.length,
  };
}