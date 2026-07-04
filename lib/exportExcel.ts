import * as XLSX from "xlsx";

export function exportReportExcel(
  report: any,
  products: any[]
) {
  const summary = [
    {
      Omzet: report.omzet,
      Transaksi: report.transaksi,
    },
  ];

  const workbook = XLSX.utils.book_new();

  const summarySheet =
    XLSX.utils.json_to_sheet(summary);

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Ringkasan"
  );

  const productSheet =
    XLSX.utils.json_to_sheet(products);

  XLSX.utils.book_append_sheet(
    workbook,
    productSheet,
    "Produk Terlaris"
  );

  XLSX.writeFile(
    workbook,
    `Laporan-${new Date().toLocaleDateString(
      "en-CA"
    )}.xlsx`
  );
}