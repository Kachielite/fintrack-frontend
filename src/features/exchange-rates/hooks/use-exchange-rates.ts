import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/core/common/constants/query-keys";
import { ExchangeRateService } from "../exchange-rates.service";

export function useExchangeRates() {
  const {
    data: rates,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.EXCHANGE_RATES],
    queryFn: () => ExchangeRateService.getRates(),
  });
  return { rates: rates ?? [], isLoading, error, refetch };
}
