import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { BudgetService } from "../budgets.service";

export function useAutoGenerateBudgets() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, data } = useMutation({
    mutationFn: () => BudgetService.autoGenerateBudgets(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    },
  });

  return {
    autoGenerate: mutate,
    isGenerating: isPending,
    isGenerated: isSuccess,
    result: data,
  };
}
