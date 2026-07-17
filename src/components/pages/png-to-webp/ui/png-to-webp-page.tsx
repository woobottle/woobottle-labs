"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
import { ToolHeader } from "widgets/tool-header";
import { PngToWebpConverter } from "features/webp-conversion";

interface PngToWebpPageProps {
  title?: string;
  description?: string;
}

export const PngToWebpPage: React.FC<PngToWebpPageProps> = ({
  title = "PNG·JPEG → WebP 변환기",
  description = "PNG·JPEG 이미지를 용량이 작은 WebP로 변환하고 ZIP으로 다운로드",
}) => {
  return (
    <AppLayout>
      <ToolHeader eyebrow="IMAGE" title={title} description={description} />

      <PngToWebpConverter />
    </AppLayout>
  );
};
