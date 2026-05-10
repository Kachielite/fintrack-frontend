import { useMutation } from "@tanstack/react-query";
import { EmailConnectionService } from "../email-connection.service";

export function useTriggerSync() {
  const mutation = useMutation({
    mutationFn: (connectionId: number) =>
      EmailConnectionService.triggerSync(connectionId),
  });
  return { triggerSync: mutation.mutate, isSyncing: mutation.isPending };
}
