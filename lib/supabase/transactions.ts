import { supabase } from "./client";

type PackageProduct = {
  id: number;
  name: string;
  qty: number;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;

  isPackage?: boolean;

  packageProducts?: PackageProduct[];
};

type TransactionPayload = {
  invoice: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paid: number;
  change: number;
  items: CartItem[];
};

export async function createTransaction(
  payload: TransactionPayload
) {
  //----------------------------------
  // SIMPAN HEADER TRANSAKSI
  //----------------------------------

  const { data: transaction, error } =
    await supabase
      .from("transactions")
      .insert({
        invoice: payload.invoice,
        payment_method: payload.paymentMethod,
        subtotal: payload.subtotal,
        discount: payload.discount,
        tax: payload.tax,
        total: payload.total,
        paid: payload.paid,
        change: payload.change,
      })
      .select()
      .single();

  if (error) throw error;

  //----------------------------------
  // DETAIL TRANSAKSI
  //----------------------------------

  const detailRows: any[] = [];

  //----------------------------------
  // STOK YANG HARUS DIKURANGI
  //----------------------------------

  const stockReduce = new Map<number, number>();

  for (const item of payload.items) {
    if (!item.isPackage) {
      detailRows.push({
        transaction_id: transaction.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty,
      });

      stockReduce.set(
        item.id,
        (stockReduce.get(item.id) ?? 0) + item.qty
      );

      continue;
    }

    //----------------------------------
    // BARIS PAKET
    //----------------------------------

    detailRows.push({
      transaction_id: transaction.id,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      qty: item.qty,
      subtotal: item.price * item.qty,
    });

    //----------------------------------
    // ISI PAKET
    //----------------------------------

    for (const donut of item.packageProducts ?? []) {
      detailRows.push({
        transaction_id: transaction.id,
        product_id: donut.id,
        product_name: " └ " + donut.name,
        price: 0,
        qty: donut.qty * item.qty,
        subtotal: 0,
      });

      stockReduce.set(
        donut.id,
        (stockReduce.get(donut.id) ?? 0) +
          donut.qty * item.qty
      );
    }
  }

  //----------------------------------
  // INSERT DETAIL
  //----------------------------------

  const { error: detailError } =
    await supabase
      .from("transaction_items")
      .insert(detailRows);

  if (detailError) throw detailError;

  //----------------------------------
  // UPDATE STOK
  //----------------------------------

  for (const [productId, qty] of stockReduce) {
    const { data: product, error } =
      await supabase
        .from("products")
        .select("stock")
        .eq("id", productId)
        .single();

    if (error) throw error;

    await supabase
      .from("products")
      .update({
        stock: Math.max(0, product.stock - qty),
      })
      .eq("id", productId);
  }

  return transaction;
}