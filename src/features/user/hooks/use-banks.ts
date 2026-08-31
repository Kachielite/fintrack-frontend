import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { BankService } from "../bank.service";

export function useBanks() {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.BANKS],
    queryFn: () => BankService.listBanks(),
    staleTime: 60 * 60 * 1000, // banks are a seeded, rarely-changing list
  });
  return { banks: data ?? [], isLoading, error };
}
