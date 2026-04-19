"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
import { CurrencyConverter } from "features/currency-conversion";

export const CurrencyConverterPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-10">
        <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
          CONVERT
        </div>
        <h1 className="text-3xl font-semibold text-white">환율 변환기</h1>
        <p className="mt-2 text-[#A3A3A3]">실시간 공개 API 기반 통화 변환</p>
      </div>

      <CurrencyConverter />
    </AppLayout>
  );
};
