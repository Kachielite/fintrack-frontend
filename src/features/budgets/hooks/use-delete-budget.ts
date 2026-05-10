import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { BudgetService } from "../budgets.service";

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => BudgetService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    },
  });

  return { deleteBudget: mutation.mutate, isDeleting: mutation.isPending };
}
