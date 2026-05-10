import { ExchangeRateDto } from "./exchange-rates.dto";
import { ExchangeRate } from "./exchange-rates.interface";

export function mapExchangeRateFromDto(dto: ExchangeRateDto): ExchangeRate {
  return {
    baseCurrency: dto.base_currency,
    targetCurrency: dto.target_currency,
    rate: dto.rate,
    fetchedAt: new Date(dto.fetched_at),
  };
}
