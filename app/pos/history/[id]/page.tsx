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
    <main className="mx-auto max-w-5xl p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-black">
            Detail Invoice
          </h1>

          <p className="mt-2 text-gray-500">
            {trx.invoice}
          </p>

        </div>

        <PrintReceiptButton
          transaction={trx}
          items={items ?? []}
        />

      </div>

      <div className="rounded-2xl border bg-white p-8">

        <div className="mb-8 grid gap-4 md:grid-cols-2">

          <div>

            <p className="text-gray-500">
              Invoice
            </p>

            <p className="font-bold">
              {trx.invoice}
            </p>

          </div>

          <div>

            <p className="text-gray-500">
              Metode
            </p>

            <p className="font-bold">
              {trx.payment_method}
            </p>

          </div>

          <div>

            <p className="text-gray-500">
              Tanggal
            </p>

            <p>
              {new Date(trx.created_at).toLocaleString("id-ID")}
            </p>

          </div>

        </div>

        <table className="mb-8 w-full">

          <thead>

            <tr className="border-b">

              <th className="py-3 text-left">
                Produk
              </th>

              <th className="text-center">
                Qty
              </th>

              <th className="text-right">
                Harga
              </th>

              <th className="text-right">
                Subtotal
              </th>

            </tr>

          </thead>

          <tbody>

            {items?.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="py-4">
                  {item.product_name}
                </td>

                <td className="text-center">
                  {item.qty}
                </td>

                <td className="text-right">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </td>

                <td className="text-right font-bold">
                  Rp {Number(item.subtotal).toLocaleString("id-ID")}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="ml-auto max-w-sm space-y-2">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {Number(trx.subtotal).toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between">
            <span>Diskon</span>
            <span>Rp {Number(trx.discount).toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between">
            <span>Pajak</span>
            <span>Rp {Number(trx.tax).toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between">
            <span>Bayar</span>
            <span>Rp {Number(trx.paid).toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between">
            <span>Kembali</span>
            <span>Rp {Number(trx.change).toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between border-t pt-3 text-xl font-black">

            <span>Total</span>

            <span className="text-pink-600">
              Rp {Number(trx.total).toLocaleString("id-ID")}
            </span>

          </div>

        </div>

      </div>

    </main>
  );
}