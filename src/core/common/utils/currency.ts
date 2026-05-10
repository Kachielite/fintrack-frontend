const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  KES: "KSh",
  EUR: "€",
  GHS: "GH₵",
  ZAR: "R",
};

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] ?? currency;
}

export function formatCurrency(amount: number, currency: string): string {
  const symbol = currencySymbol(currency);
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

export function formatTransactionAmount(
  amount: number,
  currency: string,
): string {
  const symbol = currencySymbol(currency);
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? "-" : "+";
  return `${sign}${symbol}${formatted}`;
}
