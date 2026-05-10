import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { BudgetService } from "../budgets.service";

export function useBudgetDetail(id: number) {
  const {
    data: budget,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.BUDGET_DETAIL, id],
    queryFn: () => BudgetService.getBudgetDetail(id),
  });
  return { budget, isLoading, error, refetch };
}
