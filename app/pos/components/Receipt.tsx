"use client";

type Item = {
  product_name: string;
  qty: number;
  price: number;
  subtotal: number;
};

type Props = {
  invoice: string;
  created_at: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  change: number;
  items: Item[];
};

export default function Receipt({
  invoice,
  created_at,
  payment_method,
  subtotal,
  discount,
  tax,
  total,
  paid,
  change,
  items,
}: Props) {
  return (
    <div className="w-[300px] bg-white p-4 text-[12px] font-mono text-black">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-lg font-black tracking-wider">
          DONARA
        </h1>

        <p className="text-xs">
          Point Of Sale
        </p>
      </div>

      <hr className="my-3 border-dashed border-black" />

      {/* Info transaksi */}
      <div className="space-y-1">
        <div className="flex justify-between gap-3">
          <span>Invoice</span>
          <span className="text-right font-bold">
            {invoice}
          </span>
        </div>

        <div className="flex justify-between gap-3">
          <span>Tanggal</span>
          <span className="text-right">
            {new Date(created_at).toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between gap-3">
          <span>Pembayaran</span>
          <span className="text-right font-bold">
            {payment_method}
          </span>
        </div>
      </div>

      <hr className="my-3 border-dashed border-black" />

      {/* Item */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={`${item.product_name}-${index}`} className="space-y-1">
            <div className="font-bold leading-tight">
              {item.product_name}
            </div>

            <div className="flex justify-between gap-3 text-[11px]">
              <span>
                {item.qty} × Rp {item.price.toLocaleString("id-ID")}
              </span>

              <span className="font-bold">
                Rp {item.subtotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-3 border-dashed border-black" />

      {/* Ringkasan */}
      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Diskon</span>
          <span>
            Rp {discount.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Pajak</span>
          <span>
            Rp {tax.toLocaleString("id-ID")}
          </span>
        </div>

        <hr className="my-2 border-black" />

        <div className="flex justify-between text-sm font-black">
          <span>TOTAL</span>
          <span>
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Bayar</span>
          <span>
            Rp {paid.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between font-bold">
          <span>Kembali</span>
          <span>
            Rp {change.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <hr className="my-3 border-dashed border-black" />

      {/* Footer */}
      <div className="text-center text-[11px]">
        <p>Terima kasih atas kunjungan Anda</p>

        <p className="mt-1">
          🙏 Selamat menikmati
        </p>
      </div>
    </div>
  );
}