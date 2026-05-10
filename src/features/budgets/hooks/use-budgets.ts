import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { BudgetService } from "../budgets.service";

export function useBudgets() {
  const {
    data: budgets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.BUDGETS],
    queryFn: () => BudgetService.listBudgets(),
  });
  return { budgets: budgets ?? [], isLoading, error, refetch };
}
