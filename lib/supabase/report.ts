import { supabase } from "./client";

export async function getTodayReport(period: "today" | "week" | "month" = "today") {
  const { start, end } = getDateRange(period);

  // Pastikan .from("transactions") sesuai dengan nama tabel di gambar
  const { data, error } = await supabase
    .from("transactions") 
    .select("total, created_at")
    .gte("created_at", start)
    .lte("created_at", end);

  if (error) {
    console.error("Error fetching report:", error);
    return { omzet: 0, transaksi: 0 };
  }

  const omzet = data.reduce((sum, trx) => sum + (trx.total || 0), 0);

  return {
    omzet,
    transaksi: data.length,
  };
}

export async function getTopProducts(
  period: "today" | "week" | "month" = "today"
) {
  const { start, end } = getDateRange(period);

  const { data, error } = await supabase
    .from("transaction_items")
    .select(`
      qty,
      product_name,
      transaction:transactions!transaction_id(
        created_at
      )
    `);

  if (error) throw error;

  const filtered = data.filter((item: any) => {
    if (!item.transaction) return false;

    const date = new Date(item.transaction.created_at);

    return (
      date >= new Date(start) &&
      date <= new Date(end)
    );
  });

  const map: Record<
    string,
    {
      name: string;
      qty: number;
    }
  > = {};

  filtered.forEach((item: any) => {
    if (!map[item.product_name]) {
      map[item.product_name] = {
        name: item.product_name,
        qty: 0,
      };
    }

    map[item.product_name].qty += item.qty;
  });

  return Object.values(map).sort(
    (a, b) => b.qty - a.qty
  );
}

export async function getHourlySales(
  period: "today" | "week" | "month" = "today"
) {
  const { start, end } = getDateRange(period);

  const { data, error } = await supabase
    .from("transactions")
    .select("created_at,total")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at");

  if (error) throw error;

  if (period === "today") {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      label: `${String(i).padStart(2, "0")}:00`,
      total: 0,
    }));

    data.forEach((trx) => {
      const hour = new Date(trx.created_at).getHours();
      hours[hour].total += trx.total;
    });

    return hours;
  }

  const map: Record<string, number> = {};

  data.forEach((trx) => {
    const date = new Date(trx.created_at)
      .toLocaleDateString("en-CA");

    map[date] = (map[date] || 0) + trx.total;
  });

  return Object.entries(map).map(([label, total]) => ({
    label,
    total,
  }));
}

export async function getPaymentSummary() {
  const today = new Date().toLocaleDateString("en-CA");

  const start = `${today}T00:00:00`;
  const end = `${today}T23:59:59`;

  const { data, error } = await supabase
    .from("transactions")
    .select("payment_method,total")
    .gte("created_at", start)
    .lte("created_at", end);

  if (error) throw error;

  const summary = {
    Cash: 0,
    QRIS: 0,
    Transfer: 0,
  };

  data.forEach((trx) => {
    if (trx.payment_method in summary) {
      summary[
        trx.payment_method as keyof typeof summary
      ] += trx.total;
    }
  });

  return [
    {
      name: "Cash",
      total: summary.Cash,
    },
    {
      name: "QRIS",
      total: summary.QRIS,
    },
    {
      name: "Transfer",
      total: summary.Transfer,
    },
  ];
}

export function getDateRange(period: "today" | "week" | "month") {
  const now = new Date();

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const start = new Date(now);

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;

    case "week":
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;

    case "month":
      start.setDate(now.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}