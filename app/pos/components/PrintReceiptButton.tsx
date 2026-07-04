"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Receipt from "./Receipt";

type Item = {
  id: number;
  product_name: string;
  qty: number;
  price: number;
  subtotal: number;
};

type Transaction = {
  invoice: string;
  created_at: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  change: number;
};

type Props = {
  transaction: Transaction;
  items: Item[];
};

export default function PrintReceiptButton({
  transaction,
  items,
}: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: transaction.invoice,
  });

  return (
    <>
      <button
        onClick={() => handlePrint()}
        className="rounded-xl bg-pink-600 px-5 py-3 font-bold text-white hover:bg-pink-700"
      >
        🖨 Cetak Struk
      </button>

      <div className="hidden">
        <div ref={receiptRef}>
          <Receipt
            invoice={transaction.invoice}
            created_at={transaction.created_at}
            payment_method={transaction.payment_method}
            subtotal={transaction.subtotal}
            discount={transaction.discount}
            tax={transaction.tax}
            total={transaction.total}
            paid={transaction.paid}
            change={transaction.change}
            items={items}
          />
        </div>
      </div>
    </>
  );
}