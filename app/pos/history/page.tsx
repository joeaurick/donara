import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import FilterPeriode from "./FilterPeriode";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}

export default async function PosHistoryPage({
  searchParams,
}: Props) {
  const supabase = await createClient();
  const params = await searchParams;

  const currentDate = new Date();

  const currentMonth =
    params.month ||
    String(currentDate.getMonth() + 1).padStart(2, "0");

  const currentYear =
    params.year ||
    String(currentDate.getFullYear());

  // Awal bulan (WIB → UTC)
  const start = new Date(
    `${currentYear}-${currentMonth}-01T00:00:00`
  );

  const startDate = new Date(
    start.getTime() - 7 * 60 * 60 * 1000
  ).toISOString();

  // Akhir bulan
  const nextMonth =
    Number(currentMonth) === 12
      ? "01"
      : String(Number(currentMonth) + 1).padStart(2, "0");

  const nextYear =
    Number(currentMonth) === 12
      ? String(Number(currentYear) + 1)
      : currentYear;

  const end = new Date(
    `${nextYear}-${nextMonth}-01T00:00:00`
  );

  const endDate = new Date(
    end.getTime() - 7 * 60 * 60 * 1000
  ).toISOString();

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("created_at", startDate)
    .lt("created_at", endDate)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-black text-pink-600">
          Riwayat Transaksi
        </h1>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error.message}
        </div>
      </main>
    );
  }

  const groupedTransactions: {
    [key: string]: typeof transactions;
  } = {};

  transactions?.forEach((trx) => {
    const dateKey = new Date(trx.created_at).toLocaleDateString(
      "id-ID",
      {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }

    groupedTransactions[dateKey].push(trx);
  });

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
  <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400" />

  <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-pink-600">
        📜 Transaction History
      </div>

      <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
        Riwayat Transaksi
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
        Daftar seluruh transaksi yang telah diproses pada periode yang dipilih.
      </p>
    </div>

    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
          🗓️
        </span>

        <div>
          <h2 className="text-sm font-black text-slate-900">
            Filter Periode
          </h2>

          <p className="text-xs text-slate-500">
            Pilih bulan dan tahun transaksi.
          </p>
        </div>
      </div>

      <FilterPeriode
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  </div>
</div>

      {/* Empty state */}
      {transactions?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm font-medium text-gray-400">
          Tidak ada transaksi pada periode ini.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.keys(groupedTransactions).map((dateLabel) => (
            <section key={dateLabel} className="space-y-3">
              {/* Group header */}
              <div className="flex items-center gap-3 px-1">
                <span className="rounded-md border border-pink-100 bg-pink-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-pink-600">
                  {dateLabel}
                </span>

                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {groupedTransactions[dateLabel].length} Transaksi
                </span>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-black uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="p-4">Invoice</th>
                        <th className="p-4">Jam</th>
                        <th className="p-4 text-center">Metode</th>
                        <th className="p-4 text-right">Total</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                      {groupedTransactions[dateLabel].map((trx) => {
                        const timeString = new Date(trx.created_at).toLocaleTimeString(
                          "id-ID",
                          {
                            timeZone: "Asia/Jakarta",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        );

                        const method = (trx.payment_method || "CASH").toUpperCase();

                        return (
                          <tr
                            key={trx.id}
                            className="transition-colors hover:bg-slate-50/70"
                          >
                            <td className="p-4">
                              <Link
                                href={`/pos/history/${trx.id}`}
                                className="font-bold text-pink-600 hover:underline"
                              >
                                {trx.invoice}
                              </Link>
                            </td>

                            <td className="p-4 font-mono text-gray-500">
                              {timeString}
                            </td>

                            <td className="p-4 text-center">
                              {method === "QRIS" ? (
                                <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-700">
                                  📱 QRIS
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                                  💵 CASH
                                </span>
                              )}
                            </td>

                            <td className="p-4 text-right text-sm font-black text-gray-900">
                              Rp {Number(trx.total).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}