import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import FilterPeriode from "./FilterPeriode"; // Impor komponen baru di sini

// POSISI YANG BENAR: Letakkan di sini, setelah import, sebelum fungsi dimulai
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function PosHistoryPage({ searchParams }: Props) {
  const supabase = await createClient();
  const params = await searchParams;

  // Ganti bagian penentuan tanggal menjadi seperti ini:
const currentDate = new Date();
const currentMonth = params.month || String(currentDate.getMonth() + 1).padStart(2, "0");
const currentYear = params.year || String(currentDate.getFullYear());

// Tambahkan offset 7 jam (WIB) ke dalam string tanggal
// Menggunakan format ISO yang disesuaikan dengan zona waktu lokal
const start = new Date(`${currentYear}-${currentMonth}-01T00:00:00`);
const startDate = new Date(start.getTime() - (7 * 60 * 60 * 1000)).toISOString();

// Hitung akhir bulan
const nextMonth = Number(currentMonth) === 12 ? "01" : String(Number(currentMonth) + 1).padStart(2, "0");
const nextYear = Number(currentMonth) === 12 ? String(Number(currentYear) + 1) : currentYear;
const end = new Date(`${nextYear}-${nextMonth}-01T00:00:00`);
const endDate = new Date(end.getTime() - (7 * 60 * 60 * 1000)).toISOString();

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .gte("created_at", startDate)
    .lt("created_at", endDate)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-4 xl:p-8">
        <h1 className="mb-6 text-2xl xl:text-3xl font-black">Riwayat Transaksi</h1>
        <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-600 text-sm">
          {error.message}
        </div>
      </main>
    );
  }

  const groupedTransactions: { [key: string]: typeof transactions } = {};
  transactions?.forEach((trx) => {
    const dateKey = new Date(trx.created_at).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(trx);
  } );

  return (
    <main className="p-4 xl:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl xl:text-3xl font-black text-gray-900 tracking-tight">
          Riwayat Transaksi
        </h1>

        {/* PANGGIL DI SINI: Komponen filter yang aman dari error server */}
        <FilterPeriode currentMonth={currentMonth} currentYear={currentYear} />
      </div>

      {transactions?.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm font-medium text-gray-400 bg-white">
          Tidak ada transaksi pada periode ini.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {Object.keys(groupedTransactions).map((dateLabel) => (
            <div key={dateLabel} className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-md border border-pink-100">
                  {dateLabel}
                </span>
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {groupedTransactions[dateLabel].length} Transaksi
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[11px] font-black uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="p-4">Invoice</th>
                        <th className="p-4">Jam</th>
                        <th className="p-4 text-center">Metode</th>
                        <th className="p-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                      {groupedTransactions[dateLabel].map((trx) => {
                        const timeString = new Date(trx.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const method = (trx.payment_method || "Cash").toUpperCase();

                        return (
                          <tr key={trx.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="p-4">
                              <Link href={`/pos/history/${trx.id}`} className="font-bold text-pink-600 hover:underline">
                                {trx.invoice}
                              </Link>
                            </td>
                            <td className="p-4 text-gray-500 font-mono">
                              {timeString}
                            </td>
                            <td className="p-4 text-center">
                              {method === "QRIS" ? (
                                <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-700 border border-blue-200">
                                  📱 QRIS
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700 border border-emerald-200">
                                  💵 CASH
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right font-black text-gray-900 text-sm">
                              Rp {Number(trx.total).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}