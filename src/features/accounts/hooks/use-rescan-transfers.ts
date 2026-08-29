import { useMutation } from "@tanstack/react-query";
import { AccountsService } from "../accounts.service";

/**
 * Triggers BE-1.8's on-demand transfer rescan over the user's full history.
 * Runs in the background server-side; this only confirms it started. The
 * result (and any resulting cache invalidation) arrives via a
 * transfer_scan_complete/failed notification.
 */
export function useRescanTransfers() {
  const mutation = useMutation({
    mutationFn: () => AccountsService.rescanTransfers(),
  });

  return {
    rescan: mutation.mutateAsync,
    isRescanning: mutation.isPending,
    error: mutation.error,
  };
}
