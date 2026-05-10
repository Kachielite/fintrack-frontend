import { TransactionDto, TransactionSummaryDto } from "./transactions.dto";
import {
  Transaction,
  TransactionSummary,
  CategoryType,
  TransactionType,
  TransactionStatus,
} from "./transactions.interface";

export function mapTransactionFromDto(dto: TransactionDto): Transaction {
  return {
    id: dto.id,
    merchant: dto.merchant,
    category: dto.category as CategoryType,
    transactionType: dto.transaction_type as TransactionType,
    amount: dto.amount,
    currency: dto.currency,
    refAmount: dto.ref_amount,
    refCurrency: dto.ref_currency,
    exchangeRateUsed: dto.exchange_rate_used,
    transactionDate: new Date(dto.transaction_date),
    status: dto.status as TransactionStatus,
    bankId: dto.bank_id,
    reference: dto.reference,
    balance: dto.balance,
    originalMerchant: dto.original_merchant,
    originalCategory: dto.original_category,
  };
}

export function mapTransactionSummaryFromDto(
  dto: TransactionSummaryDto,
): TransactionSummary {
  return {
    periodStart: new Date(dto.period_start),
    periodEnd: new Date(dto.period_end),
    totalSpend: dto.total_spend,
    totalIncome: dto.total_income,
    net: dto.net,
    refCurrency: dto.ref_currency,
    byCategory: dto.by_category,
    byCurrency: dto.by_currency,
    vsLastPeriodPct: dto.vs_last_period_pct,
  };
}
