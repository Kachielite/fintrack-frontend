import { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";

const TRANSACTION_AFFECTED_KEYS = [
  QUERY_KEYS.TRANSACTIONS,
  QUERY_KEYS.TRANSACTION_DETAIL,
  QUERY_KEYS.TRANSACTION_SUMMARY,
  QUERY_KEYS.LINKED_TRANSACTION,
  QUERY_KEYS.DAILY_SPEND,
  QUERY_KEYS.CHART_DATA,
  QUERY_KEYS.BUDGETS,
  QUERY_KEYS.INSIGHTS,
  QUERY_KEYS.ACCOUNTS,
] as const;

/**
 * Single source of truth for what needs invalidating when a transaction is
 * created, corrected, transferred, or otherwise changed anywhere in the app.
 * Every transaction-affecting mutation should call this instead of
 * hand-picking a subset of query keys.
 */
export function invalidateTransactionQueries(queryClient: QueryClient) {
  TRANSACTION_AFFECTED_KEYS.forEach((key) =>
    queryClient.invalidateQueries({ queryKey: [key] }),
  );
}
