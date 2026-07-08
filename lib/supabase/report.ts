import { supabase } from "./client";

function getDateRange(period: "today" | "week" | "month") {
  const now = new Date();

  const start = new Date(now);
  const end = new Date(now);

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case "week":
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case "month":
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function getTodayReport(
  period: "today" | "week" | "month" = "today"
) {
  const { start, end } = getDateRange(period);

  const { data, error } = await supabase
    .from("transactions")
    .select("id,total")
    .gte("created_at", start)
    .lte("created_at", end);

  if (error) throw error;

  return {
    omzet: data?.reduce((sum, item) => sum + Number(item.total), 0) ?? 0,
    transaksi: data?.length ?? 0,
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

  const map = new Map<string, { name: string; qty: number }>();

  data.forEach((item: any) => {
    if (!item.transaction) return;

    const created = new Date(item.transaction.created_at);

    if (created < new Date(start) || created > new Date(end)) return;

    const name = item.product_name.trim();

    if (
      name.toLowerCase().includes("paket") ||
      name.toLowerCase().startsWith("paket")
    ) {
      return;
    }

    const current = map.get(name) ?? {
      name,
      qty: 0,
    };

    current.qty += Number(item.qty);

    map.set(name, current);
  });

  return [...map.values()].sort((a, b) => b.qty - a.qty);
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
      hours[hour].total += Number(trx.total);
    });

    return hours;
  }

  const map = new Map<string, number>();

  data.forEach((trx) => {
    const key = new Date(trx.created_at).toLocaleDateString("id-ID");

    map.set(key, (map.get(key) ?? 0) + Number(trx.total));
  });

  return [...map.entries()].map(([label, total]) => ({
    label,
    total,
  }));
}

export async function getPaymentSummary(
  period: "today" | "week" | "month" = "today"
) {
  const { start, end } = getDateRange(period);

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
      summary[trx.payment_method as keyof typeof summary] += Number(trx.total);
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