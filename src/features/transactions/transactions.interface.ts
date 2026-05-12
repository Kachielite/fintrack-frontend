export type TransactionStatus =
  | "verified"
  | "unverified"
  | "review"
  | "corrected";
export type TransactionType = "debit" | "credit";
export type CategoryType =
  | "peer_to_peer_transfer"
  | "business_payment"
  | "subscriptions"
  | "entertainment_leisure"
  | "mobile_internet"
  | "utilities"
  | "groceries"
  | "retail_ecommerce"
  | "dining_food_delivery"
  | "transport"
  | "fuel_auto"
  | "travel"
  | "bank_charges"
  | "currency_conversion"
  | "salary_wages"
  | "refunds_reimbursements"
  | "healthcare"
  | "education"
  | "charity_donations"
  | "cash_withdrawal"
  | "uncategorized";

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
