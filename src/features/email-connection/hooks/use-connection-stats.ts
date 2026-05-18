import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { EmailConnectionService } from "../email-connection.service";

export function useConnectionStats(connectionId: number) {
  const { data: stats, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [QUERY_KEYS.EMAIL_CONNECTIONS, connectionId, "stats"],
    queryFn: () => EmailConnectionService.getStats(connectionId),
  });
  return { stats, isLoading, refetch, isRefetching };
}
