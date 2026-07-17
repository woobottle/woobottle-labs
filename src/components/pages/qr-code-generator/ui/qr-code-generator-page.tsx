"use client";

import React from "react";
import dynamic from "next/dynamic";
import { AppLayout } from "widgets/app-layout";
import { ToolHeader } from "widgets/tool-header";

const QrCodeGenerator = dynamic(
  () =>
    import("features/qr-code-generation").then((mod) => mod.QrCodeGenerator),
  {
    ssr: false,
    loading: () => (
      <div className="text-sm text-[#525252]">QR 생성기 로드 중…</div>
    ),
  },
);

export const QrCodeGeneratorPage: React.FC = () => {
  return (
    <AppLayout>
      <ToolHeader
        eyebrow="QR CODE"
        title="QR 코드 생성기"
        description="텍스트나 URL로 QR 코드를 생성하고 PNG로 저장하거나 공유"
      />

      <QrCodeGenerator defaultText="https://example.com" />
    </AppLayout>
  );
};
