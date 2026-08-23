import { supabase } from "./client";

export type ReportFilter = {
  period?: "today" | "week" | "month";
  startDate?: string;
  endDate?: string;
};

function getDateRange(filter: ReportFilter = {}) {
  // Jika menggunakan filter tanggal manual
  // Hari operasional: 05:00 → 02:00 besok
  if (filter.startDate && filter.endDate) {
    const start = new Date(
      `${filter.startDate}T05:00:00+07:00`
    );

    const end = new Date(
      `${filter.endDate}T02:00:59+07:00`
    );

    // Tambahkan 1 hari karena jam tutup lewat tengah malam
    end.setDate(end.getDate() + 1);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
      isToday: false,
    };
  }

  const period = filter.period || "today";

  const now = new Date();

  const start = new Date(now);
  const end = new Date(now);

  switch (period) {
    case "today": {
      // Hari operasional aktif:
      // 05:00 pagi → 02:00 dini hari berikutnya

      const businessDate = new Date(now);

      // Jika sekarang masih sebelum jam 02:00,
      // anggap masih milik hari kemarin
      if (now.getHours() < 2) {
        businessDate.setDate(
          businessDate.getDate() - 1
        );
      }

      start.setTime(businessDate.getTime());
      end.setTime(businessDate.getTime());

      // Mulai jam 05:00
      start.setHours(5, 0, 0, 0);

      // Selesai jam 02:00 besok
      end.setDate(end.getDate() + 1);
      end.setHours(2, 0, 59, 999);

      break;
    }

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
    isToday: period === "today",
  };
}

/* =========================
   OMZET & TRANSAKSI
========================= */
export async function getTodayReport(
  filter: ReportFilter = {}
) {
  const { start, end } = getDateRange(filter);

  const { data, error } = await supabase
    .from("transactions")
    .select("id,total")
    .eq("status", "COMPLETED")
    .gte("created_at", start)
    .lte("created_at", end);

  if (error) throw error;

  return {
    omzet:
      data?.reduce(
        (sum, item) => sum + Number(item.total),
        0
      ) ?? 0,

    transaksi: data?.length ?? 0,
  };
}

/* =========================
   TOTAL DONAT TERJUAL
========================= */
export async function getSoldDonuts(
  filter: ReportFilter = {}
) {
  const { start, end } = getDateRange(filter);

  const { data, error } = await supabase
    .from("transaction_items")
    .select(`
      qty,
      transaction:transactions!transaction_id(
        created_at,
        status
      )
    `);

  if (error) throw error;

  return (data ?? []).reduce((total, item: any) => {
    const transaction = item.transaction;

    if (!transaction) {
      return total;
    }

    // Hanya hitung transaksi COMPLETED
    if (transaction.status !== "COMPLETED") {
      return total;
    }

    const createdAt = new Date(
      transaction.created_at
    );

    // Hanya hitung transaksi dalam periode laporan
    if (
      createdAt < new Date(start) ||
      createdAt > new Date(end)
    ) {
      return total;
    }

    return total + Number(item.qty || 0);
  }, 0);
}

/* =========================
   PRODUK TERLARIS
========================= */
export async function getTopProducts(
  filter: ReportFilter = {}
) {
  const { start, end } = getDateRange(filter);

  const { data, error } = await supabase
    .from("transaction_items")
    .select(`
      qty,
      product_name,
      transaction:transactions!transaction_id(
        created_at,
        status
      )
    `);

  if (error) throw error;

  const map = new Map<
    string,
    { name: string; qty: number }
  >();

  data.forEach((item: any) => {
    if (!item.transaction) return;

    // Jangan hitung item dari transaksi VOID
    if (item.transaction.status !== "COMPLETED") {
      return;
    }

    const created = new Date(
      item.transaction.created_at
    );

    if (
      created < new Date(start) ||
      created > new Date(end)
    ) {
      return;
    }

    const name = item.product_name.trim();

    // Skip paket
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

  return [...map.values()].sort(
    (a, b) => b.qty - a.qty
  );
}

/* =========================
   PENJUALAN PER JAM / HARI
========================= */
export async function getHourlySales(
  filter: ReportFilter = {}
) {
  const { start, end, isToday } =
    getDateRange(filter);

  const { data, error } = await supabase
    .from("transactions")
    .select("created_at,total")
    .eq("status", "COMPLETED")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at");

  if (error) throw error;

  // Jika hari ini → tampil per jam
  if (isToday) {
    const hours = Array.from(
      { length: 24 },
      (_, i) => ({
        label: `${String(i).padStart(2, "0")}:00`,
        total: 0,
      })
    );

    data.forEach((trx) => {
      const hour = new Date(
        trx.created_at
      ).getHours();

      hours[hour].total += Number(trx.total);
    });

    return hours;
  }

  // Selain hari ini → tampil per tanggal
  const map = new Map<string, number>();

  data.forEach((trx) => {
    const key = new Date(
      trx.created_at
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

    map.set(
      key,
      (map.get(key) ?? 0) + Number(trx.total)
    );
  });

  return [...map.entries()].map(
    ([label, total]) => ({
      label,
      total,
    })
  );
}

/* =========================
   SUMMARY PEMBAYARAN
========================= */
export async function getPaymentSummary(
  filter: ReportFilter = {}
) {
  const { start, end } = getDateRange(filter);

  const { data, error } = await supabase
    .from("transactions")
    .select("payment_method,total")
    .eq("status", "COMPLETED")
    .gte("created_at", start)
    .lte("created_at", end);

  if (error) throw error;

  const summary = {
    CASH: 0,
    QRIS: 0,
    TRANSFER: 0,
  };

  data.forEach((trx) => {
    const method = (
      trx.payment_method || "CASH"
    ).toUpperCase();

    if (method in summary) {
      summary[
        method as keyof typeof summary
      ] += Number(trx.total);
    }
  });

  return [
    {
      payment_method: "CASH",
      total: summary.CASH,
    },
    {
      payment_method: "QRIS",
      total: summary.QRIS,
    },
    {
      payment_method: "TRANSFER",
      total: summary.TRANSFER,
    },
  ];
}

/* =========================
   SUMMARY WHATSAPP
========================= */
export async function getTransactionSummaryForWhatsapp(
  filter: ReportFilter = {}
) {
  const { start, end } = getDateRange(filter);

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      id,
      payment_method,
      total,
      created_at,
      transaction_items(
        qty
      )
    `
    )
    .eq("status", "COMPLETED")
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data || [];
}