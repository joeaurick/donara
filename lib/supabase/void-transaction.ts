import { supabase } from "./client";

type VoidTransactionParams = {
  transactionId: number;
  pin: string;
  reason: string;
};

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
  // 1. AMBIL USER YANG SEDANG LOGIN
  // =====================================

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User tidak ditemukan atau belum login.");
  }

  // =====================================
  // 2. AMBIL PIN USER
  // =====================================

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("id, pin_hash")
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    throw new Error("Profile user tidak ditemukan.");
  }

  if (!profile.pin_hash) {
    throw new Error("PIN belum dibuat.");
  }

  // =====================================
  // 3. VALIDASI PIN
  // =====================================

  if (profile.pin_hash !== pin) {
    throw new Error("PIN tidak valid.");
  }

  // =====================================
  // 4. CEK TRANSAKSI
  // =====================================

  const { data: transaction, error: transactionError } =
    await supabase
      .from("transactions")
      .select("id, status")
      .eq("id", transactionId)
      .maybeSingle();

  if (transactionError) {
    throw transactionError;
  }

  if (!transaction) {
    throw new Error("Transaksi tidak ditemukan.");
  }

  if (transaction.status === "VOID") {
    throw new Error("Transaksi ini sudah di-void.");
  }

  // =====================================
  // 5. VOID TRANSAKSI
  // =====================================

  const { data, error } = await supabase
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

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "Transaksi tidak dapat di-void. Status transaksi mungkin sudah berubah."
    );
  }

  return data;
}