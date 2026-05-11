import { z } from "zod";

export const correctTransactionSchema = z.object({
  merchant: z.string().optional(),
  category: z
    .enum([
      "food",
      "transit",
      "utility",
      "subs",
      "transfer",
      "fun",
      "health",
      "other",
    ])
    .optional(),
  transaction_type: z.enum(["debit", "credit"]).optional(),
  amount: z.number().optional(),
});

export type CorrectTransactionSchemaType = z.infer<
  typeof correctTransactionSchema
>;

export interface TransactionDto {
  id: number;
  merchant: string;
  category: string;
  transactionType: string;
  amount: number;
  currency: string;
  refAmount: number;
  refCurrency: string;
  exchangeRateUsed: number | null;
  transactionDate: string;
  status: string;
  bankId: number | null;
  reference: string | null;
  balance: number | null;
  originalMerchant: string | null;
  originalCategory: string | null;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  currency?: string;
  bank_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface TransactionSummaryDto {
  period_start: string;
  period_end: string;
  total_spend: number;
  total_income: number;
  net: number;
  ref_currency: string;
  by_category: {
    category: string;
    total: number;
    count: number;
    percentage: number;
  }[];
  by_currency: {
    currency: string;
    spend: number;
    income: number;
    net: number;
  }[];
  vs_last_period_pct: number | null;
}
