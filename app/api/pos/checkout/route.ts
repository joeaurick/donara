import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      cart,
      payment,
      subtotal,
      discount,
      tax,
      total,
    } = body;

    // =========================
    // Simpan transaksi
    // =========================

    const { data: trx, error: trxError } =
      await admin
        .from("transactions")
        .insert({
          subtotal,
          discount,
          tax,
          total,
          payment,
        })
        .select()
        .single();

    if (trxError) throw trxError;

    // =========================
    // Detail transaksi
    // =========================

    for (const item of cart) {
      await admin
        .from("transaction_items")
        .insert({
          transaction_id: trx.id,
          product_id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          total:
            item.price * item.qty,
        });

      // =========================
      // Produk biasa
      // =========================

      if (!item.isPackage) {
        await admin.rpc(
          "decrease_stock",
          {
            p_product: item.id,
            p_qty: item.qty,
          }
        );

        continue;
      }

      // =========================
      // Paket
      // =========================

      if (
        item.packageProducts &&
        item.packageProducts.length
      ) {
        for (const p of item.packageProducts) {
          await admin.rpc(
            "decrease_stock",
            {
              p_product: p.id,
              p_qty:
                p.qty * item.qty,
            }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      transaction: trx.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}