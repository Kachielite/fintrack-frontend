import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { updateBudgetSchema, UpdateBudgetSchemaType } from "../budgets.dto";
import { BudgetService } from "../budgets.service";

export function useUpdateBudget(id: number) {
  const queryClient = useQueryClient();
  const form = useForm<UpdateBudgetSchemaType>({
    resolver: zodResolver(updateBudgetSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateBudgetSchemaType) =>
      BudgetService.updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BUDGET_DETAIL, id],
      });
    },
  });

  return {
    form,
    isUpdating: mutation.isPending,
    updateBudget: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
