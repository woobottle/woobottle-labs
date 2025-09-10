export interface ExchangeRatesResponse {
  result: 'success' | 'error';
  provider?: string;
  documentation?: string;
  terms_of_use?: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  time_eol_unix: number;
  base_code: string;
  rates: Record<string, number>;
  error_type?: string;
}

export type CurrencyCode = string;

export interface CurrencyConversionInput {
  amount: number;
  from: CurrencyCode;
  to: CurrencyCode;
  base: CurrencyCode;
  rates: Record<string, number>;
}

export interface CurrencyConversionResult {
  convertedAmount: number;
  rate: number; // 1 from = rate to
}

