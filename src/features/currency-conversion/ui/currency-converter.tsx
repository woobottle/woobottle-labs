"use client";

import React from "react";
import { Input } from "shared/ui/input";
import { Button } from "shared/ui/button";
import { useExchangeRates } from "../model/use-exchange-rates";
import {
  convertCurrency,
  formatCurrency,
  sortCurrencyCodes,
} from "entities/currency";

export const CurrencyConverter: React.FC = () => {
  const { base, rates, isLoading, error, refresh, lastUpdated } =
    useExchangeRates({ refreshIntervalMs: 1000 * 60 * 30 });

  const allCodes = React.useMemo(
    () => sortCurrencyCodes([base, ...Object.keys(rates)]),
    [base, rates],
  );
  const [from, setFrom] = React.useState<string>("USD");
  const [to, setTo] = React.useState<string>("KRW");
  const [amount, setAmount] = React.useState<string>("1");

  React.useEffect(() => {
    // Ensure defaults exist in available codes once loaded
    if (allCodes.length > 0) {
      if (!allCodes.includes(from)) setFrom(base);
      if (!allCodes.includes(to))
        setTo(allCodes.includes("KRW") ? "KRW" : base);
    }
  }, [allCodes, base]);

  const amountNumber = parseFloat(amount) || 0;
  const { convertedAmount, rate } = convertCurrency({
    amount: amountNumber,
    from,
    to,
    base,
    rates,
  });

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">환율 변환기</h2>
            <p className="text-sm text-[#A3A3A3]">실시간 공개 API 기반 환율</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#525252]">기준 통화: {base}</div>
            {lastUpdated && (
              <div className="text-xs text-[#525252]">
                업데이트: {lastUpdated}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#A3A3A3]">
              금액
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="예: 100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#A3A3A3]">
              From
            </label>
            <select
              className="w-full p-2 rounded-md border border-[#1A1A1A] bg-[#0A0A0A] text-white"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              disabled={isLoading}
            >
              {allCodes.map((c, index) => (
                <option key={c + index} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#A3A3A3]">
              To
            </label>
            <select
              className="w-full p-2 rounded-md border border-[#1A1A1A] bg-[#0A0A0A] text-white"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={isLoading}
            >
              {allCodes.map((c, index) => (
                <option key={c + index} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button variant="primary" onClick={handleSwap} disabled={isLoading}>
            통화 바꾸기
          </Button>
          <Button variant="secondary" onClick={refresh} disabled={isLoading}>
            환율 새로고침
          </Button>
        </div>

        {error && <div className="mt-4 text-sm text-white">오류: {error}</div>}
      </div>

      <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-8">
        <div className="text-center mb-4">
          <div className="text-[#A3A3A3] text-sm">실시간 계산</div>
        </div>
        <div className="text-3xl font-semibold text-white text-center">
          {formatCurrency(amountNumber, from)} →{" "}
          {formatCurrency(convertedAmount, to)}
        </div>
        {Number.isFinite(rate) && (
          <div className="text-center text-sm text-[#A3A3A3] mt-2">
            1 {from} = {rate.toFixed(6)} {to}
          </div>
        )}
      </div>
    </div>
  );
};
