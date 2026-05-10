export interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  fetchedAt: Date;
}
