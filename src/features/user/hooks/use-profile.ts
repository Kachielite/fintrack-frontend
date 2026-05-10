import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { UserService } from "../user.service";

export function useProfile() {
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: () => UserService.getProfile(),
  });
  return { profile, isLoading, error, refetch };
}
