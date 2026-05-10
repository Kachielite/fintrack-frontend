import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { EmailConnectionService } from "../email-connection.service";

export function useGmailLabels(connectionId: number | undefined) {
  const {
    data: labels,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.GMAIL_LABELS, connectionId],
    queryFn: () => EmailConnectionService.listLabels(connectionId!),
    enabled: connectionId !== undefined,
  });
  return { labels: labels ?? [], isLoading, error };
}
