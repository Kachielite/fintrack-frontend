import apiClient from "@/core/common/network/api-client";
import { API_ENDPOINTS } from "@/core/common/network/api-endpoints";
import { ExchangeRateDto } from "./exchange-rates.dto";
import { ExchangeRate } from "./exchange-rates.interface";
import { mapExchangeRateFromDto } from "./exchange-rates.mapper";

export const ExchangeRateService = {
  async getRates(): Promise<ExchangeRate[]> {
    const { data } = await apiClient.get<ExchangeRateDto[]>(
      API_ENDPOINTS.EXCHANGE_RATES,
    );
    return data.map(mapExchangeRateFromDto);
  },
};
