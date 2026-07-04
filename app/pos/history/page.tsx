import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PosHistoryPage() {
  const supabase = await createClient();

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="mb-6 text-3xl font-black">
          Riwayat Transaksi
        </h1>

        <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-600">
          {error.message}
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-black">
        Riwayat Transaksi
      </h1>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Tanggal</th>
              <th className="p-4 text-left">Metode</th>
              <th className="p-4 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {transactions?.map((trx) => (
              <tr key={trx.id} className="border-t">
                <td className="p-4">
        <Link
       href={`/pos/history/${trx.id}`}
       className="font-bold text-pink-600 hover:underline"
       >
        {trx.invoice}
      </Link>
      </td>

                <td className="p-4">
                  {new Date(trx.created_at).toLocaleString("id-ID")}
                </td>

                <td className="p-4">
                  {trx.payment_method}
                </td>

                <td className="p-4 text-right font-bold text-pink-600">
                  Rp {Number(trx.total).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}

            {transactions?.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-gray-400"
                >
                  Belum ada transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}