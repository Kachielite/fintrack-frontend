import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { updateUserSchema, UpdateUserSchemaType } from "../user.dto";
import { UserService } from "../user.service";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const form = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateUserSchemaType) => UserService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
  });

  return {
    form,
    isUpdating: mutation.isPending,
    updateProfile: form.handleSubmit((data) => mutation.mutate(data)),
  };
}
