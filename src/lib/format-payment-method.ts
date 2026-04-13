export function formatPaymentMethod(raw: string | null | undefined): string {
  if (!raw) return "Belirtilmemiş";
  switch (raw) {
    case "credit_card":
      return "Kredi Kartı";
    case "cash_on_delivery":
      return "Kapıda Ödeme";
    case "bank_transfer":
      return "Havale/EFT";
    // Legacy Turkish storage (pre-rewrite). Historical orders pass through unchanged.
    case "Kredi Kartı":
    case "Kapıda Ödeme":
    case "Havale/EFT":
      return raw;
    default:
      return raw;
  }
}
