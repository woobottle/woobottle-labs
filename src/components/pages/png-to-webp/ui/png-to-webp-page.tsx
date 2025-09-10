'use client';

import React from 'react';
import { AppLayout } from 'widgets/app-layout';
import { PngToWebpConverter } from 'features/webp-conversion';

export const PngToWebpPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
            <span className="text-2xl">🖼️</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          PNG → WebP 변환기
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          PNG 이미지를 용량이 작은 WebP로 손쉽게 변환하세요. 여러 파일을 한 번에 처리하고 ZIP으로 다운로드할 수 있습니다.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm font-medium">여러 파일 지원</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            <span className="text-sm font-medium">품질 조절</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
            <span className="text-sm font-medium">ZIP 다운로드</span>
          </div>
        </div>
      </div>

      <PngToWebpConverter />
    </AppLayout>
  );
};


