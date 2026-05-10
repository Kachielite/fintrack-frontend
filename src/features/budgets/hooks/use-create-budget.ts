import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { createBudgetSchema, CreateBudgetSchemaType } from "../budgets.dto";
import { BudgetService } from "../budgets.service";

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const form = useForm<CreateBudgetSchemaType>({
    resolver: zodResolver(createBudgetSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CreateBudgetSchemaType) =>
      BudgetService.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BUDGETS] });
    },
  });

  return {
    form,
    isCreating: mutation.isPending,
    createBudget: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
