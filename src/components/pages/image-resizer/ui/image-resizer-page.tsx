"use client";

import React from "react";
import { AppLayout } from "../../../../widgets/app-layout";
import { ImageResizer } from "../../../../features/image-resizer";

export const ImageResizerPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-10">
        <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
          IMAGE
        </div>
        <h1 className="text-3xl font-semibold text-white">이미지 리사이저</h1>
        <p className="mt-2 text-[#A3A3A3]">
          이미지를 업로드하고 원하는 크기로 조절
        </p>
      </div>
      <ImageResizer />
    </AppLayout>
  );
};
