import { z } from "zod";

export const correctTransactionSchema = z.object({
  merchant: z.string().optional(),
  category: z.string().min(1).optional(),
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
  bankName?: string | null;
  bankShortCode?: string | null;
  accountId: number | null;
  excludeFromTotals: boolean;
  reference: string | null;
  balance: number | null;
  originalMerchant: string | null;
  originalCategory: string | null;
}

export interface CreateManualTransactionPayload {
  merchant: string;
  category: string;
  transaction_type: "debit" | "credit";
  amount: number;
  currency: string;
  transaction_date: string;
  account_id?: number;
  reference?: string;
  balance?: number;
}

// Shape of the accepted-upload response from POST /transactions/import —
// the file has been validated and queued, not yet fully processed. The real
// result (imported/skippedDuplicates/skippedInvalid/errors, still the same
// shape as ImportStatementResultDto below) arrives later as the `data`
// field on an `import_complete` notification, not from this endpoint.
export interface ImportQueuedDto {
  status: string;
  message: string;
}

// Optional import destination — pins the import to a specific account
// instead of the backend falling back to the user's app-wide refCurrency.
// Exactly one of accountId or currency should be set; providing both is
// rejected by the backend.
export interface ImportTarget {
  accountId?: number;
  currency?: string;
  bankId?: number;
  label?: string;
}

// Shape of the `data` field on an import_complete notification (see
// notifications.interface.ts on the backend) — not returned by any request
// directly anymore, kept for typing that payload where it's read.
export interface ImportStatementResultDto {
  imported: number;
  skippedDuplicates: number;
  skippedInvalid: number;
  errors: string[];
}

export interface PickedStatementFile {
  uri: string;
  name: string;
  mimeType?: string;
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
  exclude_from_totals?: boolean;
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
