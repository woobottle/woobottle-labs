'use client';

import React from 'react';
import { AppLayout } from 'widgets/app-layout';
import { QrCodeGenerator } from 'features/qr-code-generation';

export const QrCodeGeneratorPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-2xl">🔳</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          QR 코드 생성기
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          텍스트나 URL로 QR 코드를 생성하고, PNG로 저장하거나 공유하세요.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
            <span className="text-sm font-medium">실시간 생성</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
            <span className="text-sm font-medium">공유 기능</span>
          </div>
        </div>
      </div>

      <QrCodeGenerator defaultText="https://example.com" />
    </AppLayout>
  );
};


