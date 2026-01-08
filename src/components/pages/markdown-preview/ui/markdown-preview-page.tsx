'use client';

import React from 'react';
import { AppLayout } from 'widgets/app-layout';
import { MarkdownPreview } from 'features/markdown-preview';

export const MarkdownPreviewPage: React.FC = () => {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
            <span className="text-2xl">📝</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Markdown 미리보기
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Markdown 텍스트를 실시간으로 작성하고 렌더링된 결과를 바로 확인하세요.
          GitHub, Notion, 블로그 등에서 사용할 수 있는 Markdown 문서를 빠르게 작성할 수 있습니다.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="text-sm font-medium">실시간 미리보기</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 rounded-full">
            <span className="text-sm font-medium">HTML 변환</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            <span className="text-sm font-medium">복사 기능</span>
          </div>
        </div>
      </div>

      <MarkdownPreview />
    </AppLayout>
  );
};
