import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportReportPdf(
  report: any,
  products: any[]
) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("DONARA POS", 14, 20);

  doc.setFontSize(12);
  doc.text("Laporan Penjualan", 14, 30);

  doc.text(
    `Tanggal : ${new Date().toLocaleDateString("id-ID")}`,
    14,
    38
  );

  doc.setFontSize(14);

  doc.text(
    `Omzet : Rp ${report.omzet.toLocaleString("id-ID")}`,
    14,
    52
  );

  doc.text(
    `Transaksi : ${report.transaksi}`,
    14,
    62
  );

  autoTable(doc, {
    startY: 75,
    head: [["Produk", "Qty"]],
    body: products.map((item) => [
      item.name,
      item.qty,
    ]),
  });

  doc.save(
    `Laporan-${new Date().toLocaleDateString(
      "en-CA"
    )}.pdf`
  );
}