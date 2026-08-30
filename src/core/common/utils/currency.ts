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

export function formatCompactCurrency(amount: number, currency: string): string {
  const symbol = currencySymbol(currency);
  const abs = Math.abs(amount);
  let formatted: string;
  if (abs >= 1_000_000) {
    formatted = `${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    formatted = `${(abs / 1_000).toFixed(1)}k`;
  } else {
    formatted = Math.round(abs).toString();
  }
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
