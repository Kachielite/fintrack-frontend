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
    transactionType: dto.transactionType as TransactionType,
    amount: dto.amount,
    currency: dto.currency,
    refAmount: dto.refAmount,
    refCurrency: dto.refCurrency,
    exchangeRateUsed: dto.exchangeRateUsed,
    transactionDate: new Date(dto.transactionDate),
    status: dto.status as TransactionStatus,
    bankId: dto.bankId,
    reference: dto.reference,
    balance: dto.balance,
    originalMerchant: dto.originalMerchant,
    originalCategory: dto.originalCategory,
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
