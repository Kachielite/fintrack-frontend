import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { setLabelSchema, SetLabelSchemaType } from "../email-connection.dto";
import { EmailConnectionService } from "../email-connection.service";

export function useSetLabel(connectionId: number) {
  const queryClient = useQueryClient();
  const form = useForm<SetLabelSchemaType>({
    resolver: zodResolver(setLabelSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: SetLabelSchemaType) =>
      EmailConnectionService.setLabel(connectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EMAIL_CONNECTIONS],
      });
    },
  });

  return {
    form,
    isSettingLabel: mutation.isPending,
    setLabel: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
