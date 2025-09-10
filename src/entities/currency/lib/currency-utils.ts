import { CurrencyConversionInput, CurrencyConversionResult } from '../model/types';

export function convertCurrency(input: CurrencyConversionInput): CurrencyConversionResult {
  const { amount, from, to, base, rates } = input;

  if (!Number.isFinite(amount)) {
    return { convertedAmount: NaN, rate: NaN };
  }

  const rateFrom = from === base ? 1 : rates[from];
  const rateTo = to === base ? 1 : rates[to];

  if (!rateFrom || !rateTo) {
    return { convertedAmount: NaN, rate: NaN };
  }

  // rates are relative to base (e.g., base USD: rates[EUR] = 0.85 USD->EUR)
  // Convert amount in `from` to base, then to `to`.
  const amountInBase = amount / rateFrom;
  const convertedAmount = amountInBase * rateTo;
  const rate = rateTo / rateFrom;

  return { convertedAmount, rate };
}

export function formatCurrency(value: number, currency: string, locale: string = 'ko-KR'): string {
  if (!Number.isFinite(value)) return '';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  } catch {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
  }
}

export function sortCurrencyCodes(codes: string[]): string[] {
  return [...codes].sort((a, b) => a.localeCompare(b));
}

