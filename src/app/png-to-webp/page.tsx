import { PngToWebpPage } from 'components/pages/png-to-webp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PNG → WebP 변환기 | WooBottle Labs',
  description: '여러 PNG 이미지를 WebP로 변환하고 ZIP으로 한번에 다운로드하세요. 품질 조절 지원.',
  keywords: ['PNG WebP 변환', '이미지 압축', 'WebP Converter', 'PNG to WebP', '이미지 최적화'],
  openGraph: {
    title: 'PNG → WebP 변환기',
    description: '여러 PNG 이미지를 WebP로 변환하고 ZIP으로 다운로드',
    type: 'website',
  },
};

export default function PngToWebpRoute() {
  return <PngToWebpPage />;
}


