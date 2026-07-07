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
  console.log("========== CREATE TRANSACTION ==========");
  console.log(payload);

  //----------------------------------
  // SIMPAN HEADER
  //----------------------------------

  const trxResult = await supabase
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
    .maybeSingle();

  console.log("HEADER RESULT");
  console.log(trxResult);

  if (trxResult.error) {
    console.error(trxResult.error);
    throw trxResult.error;
  }

  const transaction = trxResult.data;

if (!transaction) {
  throw new Error("Transaction gagal dibuat.");
}

  //----------------------------------
  // DETAIL
  //----------------------------------

  const detailRows: any[] = [];

  //----------------------------------
  // STOK
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

    detailRows.push({
      transaction_id: transaction.id,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      qty: item.qty,
      subtotal: item.price * item.qty,
    });

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

  console.log("DETAIL ROWS");
  console.table(detailRows);

  //----------------------------------
  // INSERT DETAIL
  //----------------------------------

  const detailResult = await supabase
    .from("transaction_items")
    .insert(detailRows)
    .select();

  console.log("DETAIL RESULT");
  console.log(detailResult);

  if (detailResult.error) {
    console.error("DETAIL ERROR");
    console.error(detailResult.error);
    throw detailResult.error;
  }

  //----------------------------------
// UPDATE STOK
//----------------------------------

for (const [productId, qty] of stockReduce) {
  const productResult = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .maybeSingle();

  console.log("PRODUCT");
  console.log(productResult);

  if (productResult.error) {
    console.error(productResult.error);
    throw productResult.error;
  }

  const product = productResult.data;

  if (!product) {
    throw new Error(`Produk ${productId} tidak ditemukan.`);
  }

  const updateResult = await supabase
    .from("products")
    .update({
      stock: Math.max(0, product.stock - qty),
    })
    .eq("id", productId);

  console.log("UPDATE STOCK");
  console.log(updateResult);

  if (updateResult.error) {
    console.error(updateResult.error);
    throw updateResult.error;
  }
}

  console.log("TRANSACTION SUCCESS");

  return transaction;
}