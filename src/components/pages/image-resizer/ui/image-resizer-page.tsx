"use client";

import React from "react";
import { AppLayout } from "../../../../widgets/app-layout";
import { ToolHeader } from "widgets/tool-header";
import { ImageResizer } from "../../../../features/image-resizer";

export const ImageResizerPage: React.FC = () => {
  return (
    <AppLayout>
      <ToolHeader
        eyebrow="IMAGE"
        title="이미지 리사이저"
        description="이미지를 업로드하고 원하는 크기로 조절"
      />
      <ImageResizer />
    </AppLayout>
  );
};
