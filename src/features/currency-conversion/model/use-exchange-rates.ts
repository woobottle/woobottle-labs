'use client';

import React from 'react';
import { ExchangeRatesResponse } from 'entities/currency';

const API_URL = 'https://open.er-api.com/v6/latest/USD';

interface UseExchangeRatesOptions {
  refreshIntervalMs?: number;
}

export function useExchangeRates(options: UseExchangeRatesOptions = {}) {
  const { refreshIntervalMs } = options;
  const [data, setData] = React.useState<ExchangeRatesResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRates = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ExchangeRatesResponse;
      if (json.result !== 'success') {
        throw new Error(json.error_type || 'Failed to load exchange rates');
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  React.useEffect(() => {
    if (!refreshIntervalMs) return;
    const id = setInterval(fetchRates, refreshIntervalMs);
    return () => clearInterval(id);
  }, [fetchRates, refreshIntervalMs]);

  const lastUpdated = data?.time_last_update_utc;
  const base = data?.base_code || 'USD';
  const rates = data?.rates || {};

  return { data, base, rates, isLoading, error, refresh: fetchRates, lastUpdated };
}


