export type TransactionStatus =
  | "verified"
  | "unverified"
  | "review"
  | "corrected";
export type TransactionType = "debit" | "credit";
export type CategoryType = string;

export interface Transaction {
  id: number;
  merchant: string;
  category: CategoryType;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  refAmount: number;
  refCurrency: string;
  exchangeRateUsed: number | null;
  transactionDate: Date;
  status: TransactionStatus;
  bankId: number | null;
  bankName?: string | null;
  bankShortCode?: string | null;
  reference: string | null;
  balance: number | null;
  originalMerchant: string | null;
  originalCategory: string | null;
}

export interface TransactionSummary {
  periodStart: Date;
  periodEnd: Date;
  totalSpend: number;
  totalIncome: number;
  net: number;
  refCurrency: string;
  byCategory: {
    category: string;
    total: number;
    count: number;
    percentage: number;
  }[];
  byCurrency: {
    currency: string;
    spend: number;
    income: number;
    net: number;
  }[];
  vsLastPeriodPct: number | null;
}
