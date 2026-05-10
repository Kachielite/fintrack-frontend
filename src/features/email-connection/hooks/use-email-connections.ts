import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { EmailConnectionService } from "../email-connection.service";

export function useEmailConnections() {
  const {
    data: connections,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.EMAIL_CONNECTIONS],
    queryFn: () => EmailConnectionService.listConnections(),
  });
  return { connections: connections ?? [], isLoading, error, refetch };
}
