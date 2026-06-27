"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
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
      <div className="mb-10">
        <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
          IMAGE
        </div>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-[#A3A3A3]">{description}</p>
      </div>

      <PngToWebpConverter />
    </AppLayout>
  );
};
