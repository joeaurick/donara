import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PrintReceiptButton from "@/app/pos/components/PrintReceiptButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TransactionDetail({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: trx } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!trx) notFound();

  const { data: items } = await supabase
    .from("transaction_items")
    .select("*")
    .eq("transaction_id", id);

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">
            Detail Invoice
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {trx.invoice}
          </p>
        </div>

        <PrintReceiptButton
          transaction={trx}
          items={items ?? []}
        />
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Info */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Invoice
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {trx.invoice}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Metode Pembayaran
            </p>

            <p className="mt-1 font-bold text-gray-900">
              {trx.payment_method}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">
              Tanggal Transaksi
            </p>

            <p className="mt-1 text-gray-900">
              {new Date(trx.created_at).toLocaleString(
                "id-ID",
                {
                  timeZone: "Asia/Jakarta",
                  hour12: false,
                }
              )}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="mb-8 w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm font-black uppercase tracking-wider text-gray-500">
                <th className="py-3 text-left">Produk</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Harga</th>
                <th className="py-3 text-right">Subtotal</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60">
                  <td className="py-4 font-medium text-gray-900">
                    {item.product_name}
                  </td>

                  <td className="text-center font-semibold">
                    {item.qty}
                  </td>

                  <td className="text-right">
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </td>

                  <td className="text-right font-black text-gray-900">
                    Rp {Number(item.subtotal).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="ml-auto max-w-sm space-y-3 rounded-xl bg-gray-50 p-5 border border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">
              Rp {Number(trx.subtotal).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Diskon</span>
            <span className="font-semibold text-gray-900">
              Rp {Number(trx.discount).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Pajak</span>
            <span className="font-semibold text-gray-900">
              Rp {Number(trx.tax).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Bayar</span>
            <span className="font-semibold text-gray-900">
              Rp {Number(trx.paid).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Kembali</span>
            <span className="font-semibold text-gray-900">
              Rp {Number(trx.change).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-black">
            <span className="text-gray-900">Total</span>

            <span className="text-pink-600">
              Rp {Number(trx.total).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}