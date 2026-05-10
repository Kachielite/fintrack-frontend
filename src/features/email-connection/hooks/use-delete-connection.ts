import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { EmailConnectionService } from "../email-connection.service";

export function useDeleteConnection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => EmailConnectionService.deleteConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EMAIL_CONNECTIONS],
      });
    },
  });

  return { deleteConnection: mutation.mutate, isDeleting: mutation.isPending };
}
