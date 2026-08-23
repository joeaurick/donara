import { supabase } from "./client";

type VoidTransactionParams = {
  transactionId: string;
  pin: string;
  reason: string;
};

type TransactionItem = {
  product_id: number | string | null;
  product_name: string | null;
  qty: number | null;
};

type ProductStock = {
  id: number | string;
  stock: number | null;
  track_stock: boolean | null;
};

function isPackageDetailItem(item: TransactionItem) {
  return item.product_name?.trimStart().startsWith("└") ?? false;
}

export async function voidTransaction({
  transactionId,
  pin,
  reason,
}: VoidTransactionParams) {
  if (!pin.trim()) {
    throw new Error("PIN wajib diisi.");
  }

  if (!reason.trim()) {
    throw new Error("Alasan void wajib diisi.");
  }

  // =====================================
  // 1. CEK USER YANG SEDANG LOGIN
  // =====================================
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User tidak ditemukan. Silakan login kembali.");
  }

  // =====================================
  // 2. VALIDASI PIN VOID
  // Gunakan RPC yang sudah dipakai project
  // =====================================
  const { data: isPinValid, error: pinError } =
    await supabase.rpc("verify_void_pin", {
      p_user_id: user.id,
      p_pin: pin,
    });

  if (pinError) {
    throw pinError;
  }

  if (!isPinValid) {
    throw new Error("PIN salah.");
  }

  // =====================================
  // 3. AMBIL TRANSAKSI DAN ITEM
  // =====================================
  const { data: transaction, error: transactionError } =
    await supabase
      .from("transactions")
      .select(
        `
          id,
          status,
          created_at,
          transaction_items(
            product_id,
            product_name,
            qty
          )
        `
      )
      .eq("id", transactionId)
      .maybeSingle();

  if (transactionError) {
    throw transactionError;
  }

  if (!transaction) {
    throw new Error("Data transaksi tidak ditemukan.");
  }

  if (transaction.status === "VOID") {
    throw new Error("Transaksi ini sudah pernah di-VOID.");
  }

  if (transaction.status !== "COMPLETED") {
    throw new Error(
      "Hanya transaksi COMPLETED yang dapat di-VOID."
    );
  }

  const items: TransactionItem[] =
    transaction.transaction_items ?? [];

  // =====================================
  // 4. TENTUKAN ITEM YANG BENAR-BENAR
  // MENGURANGI STOK
  //
  // - Isi paket: product_name diawali └
  //   dan selalu mengurangi stok.
  // - Produk biasa: ikuti products.track_stock.
  // - Header paket tidak dikembalikan sebagai
  //   stok karena stok sudah diwakili isi paket.
  // =====================================
  const productIds = [
    ...new Set(
      items
        .map((item) => item.product_id)
        .filter(
          (id): id is number | string => id !== null
        )
    ),
  ];

  let products: ProductStock[] = [];

  if (productIds.length > 0) {
    const { data: productData, error: productsError } =
      await supabase
        .from("products")
        .select("id, stock, track_stock")
        .in("id", productIds);

    if (productsError) {
      throw productsError;
    }

    products = productData ?? [];
  }

  const productMap = new Map(
    products.map((product) => [
      String(product.id),
      product,
    ])
  );

  const stockReturn = new Map<string, number>();

  for (const item of items) {
    const qty = Number(item.qty || 0);

    if (!item.product_id || qty <= 0) {
      continue;
    }

    const product = productMap.get(
      String(item.product_id)
    );

    if (!product) {
      throw new Error(
        `Produk dengan ID ${item.product_id} tidak ditemukan.`
      );
    }

    const isPackageDetail = isPackageDetailItem(item);

    const shouldReturnStock =
      isPackageDetail || product.track_stock === true;

    if (!shouldReturnStock) {
      continue;
    }

    const key = String(product.id);

    stockReturn.set(
      key,
      (stockReturn.get(key) ?? 0) + qty
    );
  }

  const totalVoidQty = [...stockReturn.values()].reduce(
    (sum, qty) => sum + qty,
    0
  );

  // =====================================
  // 5. VOID TRANSAKSI
  // Kondisi COMPLETED mencegah double void
  // =====================================
  const { data: voidedTransaction, error: voidError } =
    await supabase
      .from("transactions")
      .update({
        status: "VOID",
        voided_at: new Date().toISOString(),
        voided_by: user.id,
        void_reason: reason.trim(),
      })
      .eq("id", transactionId)
      .eq("status", "COMPLETED")
      .select()
      .maybeSingle();

  if (voidError) {
    throw voidError;
  }

  if (!voidedTransaction) {
    throw new Error(
      "Transaksi gagal di-VOID atau status transaksi sudah berubah."
    );
  }

  // =====================================
  // 6. KEMBALIKAN STOK PRODUK
  // =====================================
  for (const [productId, qty] of stockReturn) {
    const product = productMap.get(productId);

    if (!product) {
      throw new Error(
        `Produk dengan ID ${productId} tidak ditemukan.`
      );
    }

    const newStock =
      Number(product.stock || 0) + qty;

    const { error: updateProductError } = await supabase
      .from("products")
      .update({
        stock: newStock,
      })
      .eq("id", product.id);

    if (updateProductError) {
      throw updateProductError;
    }
  }

  // =====================================
  // 7. KEMBALIKAN DAILY STOCK
  // Gunakan tanggal transaksi, bukan stok terbaru
  // =====================================
  if (totalVoidQty > 0) {
    const stockDate = new Date(transaction.created_at)
      .toISOString()
      .split("T")[0];

    const { data: dailyStock, error: dailyStockError } =
      await supabase
        .from("daily_stock")
        .select("id, opening_stock, remaining_stock")
        .eq("stock_date", stockDate)
        .maybeSingle();

    if (dailyStockError) {
      throw dailyStockError;
    }

    if (!dailyStock) {
      throw new Error(
        "Data stok harian untuk tanggal transaksi tidak ditemukan."
      );
    }

    const newRemainingStock = Math.min(
      Number(dailyStock.opening_stock || 0),
      Number(dailyStock.remaining_stock || 0) +
        totalVoidQty
    );

    const { error: updateDailyStockError } = await supabase
      .from("daily_stock")
      .update({
        remaining_stock: newRemainingStock,
      })
      .eq("id", dailyStock.id);

    if (updateDailyStockError) {
      throw updateDailyStockError;
    }
  }

  return {
    transaction: voidedTransaction,
    returnedQty: totalVoidQty,
  };
}