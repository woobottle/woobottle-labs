"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
import { QrCodeGenerator } from "features/qr-code-generation";

export const QrCodeGeneratorPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-10">
        <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
          QR CODE
        </div>
        <h1 className="text-3xl font-semibold text-white">QR 코드 생성기</h1>
        <p className="mt-2 text-[#A3A3A3]">
          텍스트나 URL로 QR 코드를 생성하고 PNG로 저장하거나 공유
        </p>
      </div>

      <QrCodeGenerator defaultText="https://example.com" />
    </AppLayout>
  );
};
