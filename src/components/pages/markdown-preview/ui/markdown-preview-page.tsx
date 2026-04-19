"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
import { MarkdownPreview } from "features/markdown-preview";

export const MarkdownPreviewPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-10">
        <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
          WRITE
        </div>
        <h1 className="text-3xl font-semibold text-white">Markdown 미리보기</h1>
        <p className="mt-2 text-[#A3A3A3]">
          Markdown을 실시간으로 작성하고 HTML로 변환
        </p>
      </div>

      <MarkdownPreview />
    </AppLayout>
  );
};
