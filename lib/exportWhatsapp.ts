export type WhatsappReportData = {
  dateLabel: string;
  totalDonut: number;
  totalPorsi: number;
  omzet: number;
  cash: number;
  qris: number;
  transfer: number;
  transactions: {
    porsi: number;
    paymentMethod: string;
    total: number;
  }[];
};

export function openWhatsappReport(
  data: WhatsappReportData
) {
  const lines = [
    "🍩 *LAPORAN PENJUALAN DONARA*",
    "",
    `📅 *${data.dateLabel}*`,
    "",
    "📦 *Ringkasan*",
    `• Total Donat : *${data.totalDonut} pcs*`,
    `• Total Porsi : *${data.totalPorsi} porsi*`,
    `• Total Omzet : *Rp${data.omzet.toLocaleString("id-ID")}*`,
    "",
    "💳 *Pembayaran*",
    `• Cash : *Rp${data.cash.toLocaleString("id-ID")}*`,
    `• QRIS : *Rp${data.qris.toLocaleString("id-ID")}*`,
    `• Transfer : *Rp${data.transfer.toLocaleString("id-ID")}*`,
    "",
    "📝 *Detail Transaksi*",
    ...data.transactions.map(
      (trx) =>
        `• ${trx.porsi} porsi / ${trx.paymentMethod.toUpperCase()} / Rp${trx.total.toLocaleString("id-ID")}`
    ),
    "",
    "Terima kasih 🙏",
  ];

  const text = lines.join("\n");

  // Ganti nomor tujuan di sini
  window.open(
  `https://wa.me/?text=${encodeURIComponent(text)}`,
  "_blank"
);
}