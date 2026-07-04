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

export default function Receipt(props: Props) {
  return (
    <div className="mx-auto w-[300px] bg-white p-4 text-sm">

      <h1 className="text-center text-xl font-black">
        DONARA
      </h1>

      <p className="text-center">
        Point Of Sale
      </p>

      <hr className="my-3" />

      <div className="space-y-1">

        <div className="flex justify-between">
          <span>Invoice</span>
          <span>{props.invoice}</span>
        </div>

        <div className="flex justify-between">
          <span>Tanggal</span>
          <span>
            {new Date(props.created_at).toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Pembayaran</span>
          <span>{props.payment_method}</span>
        </div>

      </div>

      <hr className="my-3" />

      {props.items.map((item) => (

        <div
          key={item.product_name}
          className="mb-2"
        >

          <div className="font-bold">
            {item.product_name}
          </div>

          <div className="flex justify-between">

            <span>
              {item.qty} × Rp{" "}
              {item.price.toLocaleString("id-ID")}
            </span>

            <span>
              Rp{" "}
              {item.subtotal.toLocaleString("id-ID")}
            </span>

          </div>

        </div>

      ))}

      <hr className="my-3" />

      <div className="space-y-1">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            Rp {props.subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Diskon</span>
          <span>
            Rp {props.discount.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Pajak</span>
          <span>
            Rp {props.tax.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>
            Rp {props.total.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Bayar</span>
          <span>
            Rp {props.paid.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Kembali</span>
          <span>
            Rp {props.change.toLocaleString("id-ID")}
          </span>
        </div>

      </div>

      <hr className="my-3" />

      <p className="text-center">
        Terima kasih 🙏
      </p>

    </div>
  );
}