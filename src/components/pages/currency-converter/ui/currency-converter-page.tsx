'use client';

import React from 'react';
import { AppLayout } from 'widgets/app-layout';
import { CurrencyConverter } from 'features/currency-conversion';

export const CurrencyConverterPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4">
            <span className="text-2xl">💱</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          환율 변환기
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          실시간 공개 API를 사용해 다양한 통화 간 금액을 간편하게 변환하세요.
        </p>
      </div>

      <CurrencyConverter />
    </AppLayout>
  );
};


