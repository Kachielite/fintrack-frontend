import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import {
  correctTransactionSchema,
  CorrectTransactionSchemaType,
} from "../transactions.dto";
import { TransactionService } from "../transactions.service";

export function useCorrectTransaction(id: number) {
  const queryClient = useQueryClient();

  const form = useForm<CorrectTransactionSchemaType>({
    resolver: zodResolver(correctTransactionSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CorrectTransactionSchemaType) =>
      TransactionService.correctTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTION_DETAIL, id],
      });
    },
  });

  return {
    form,
    isCorrectingTransaction: mutation.isPending,
    correctTransaction: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
