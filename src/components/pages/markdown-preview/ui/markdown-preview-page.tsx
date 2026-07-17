"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
import { ToolHeader } from "widgets/tool-header";
import { MarkdownPreview } from "features/markdown-preview";

export const MarkdownPreviewPage: React.FC = () => {
  return (
    <AppLayout>
      <ToolHeader
        eyebrow="WRITE"
        title="Markdown 미리보기"
        description="Markdown을 실시간으로 작성하고 HTML로 변환"
      />

      <MarkdownPreview />
    </AppLayout>
  );
};
