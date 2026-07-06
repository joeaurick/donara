export function generateInvoice(lastNumber: number) {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const number = String(lastNumber + 1).padStart(4, "0");

  return `INV-${year}${month}${day}-${number}`;
}