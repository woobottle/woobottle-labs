"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
import { ToolHeader } from "widgets/tool-header";
import { CurrencyConverter } from "features/currency-conversion";

export const CurrencyConverterPage: React.FC = () => {
  return (
    <AppLayout>
      <ToolHeader
        eyebrow="CONVERT"
        title="환율 변환기"
        description="실시간 공개 API 기반 통화 변환"
      />

      <CurrencyConverter />
    </AppLayout>
  );
};
