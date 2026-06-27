import { PngToWebpPage } from "components/pages/png-to-webp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPEG → WebP 변환기 | WooBottle Labs",
  description:
    "여러 JPEG 이미지를 WebP로 변환하고 ZIP으로 한번에 다운로드하세요. 품질 조절 지원.",
  keywords: [
    "JPEG WebP 변환",
    "JPG WebP 변환",
    "이미지 압축",
    "WebP Converter",
    "JPEG to WebP",
    "이미지 최적화",
  ],
  openGraph: {
    title: "JPEG → WebP 변환기",
    description: "여러 JPEG 이미지를 WebP로 변환하고 ZIP으로 다운로드",
    type: "website",
  },
};

export default function JpegToWebpRoute() {
  return (
    <PngToWebpPage
      title="JPEG → WebP 변환기"
      description="JPEG 이미지를 용량이 작은 WebP로 변환하고 ZIP으로 다운로드 (PNG도 지원)"
    />
  );
}
