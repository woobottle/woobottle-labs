import { QrCodeGeneratorPage } from 'components/pages/qr-code-generator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR 코드 생성기 | WooBottle Labs',
  description: '텍스트나 URL로 QR 코드를 생성하고, PNG로 저장하거나 공유하세요.',
  keywords: ['QR 코드', 'qrcode', 'qr generator', '공유', '이미지 다운로드'],
  openGraph: {
    title: 'QR 코드 생성기',
    description: '텍스트나 URL로 QR 코드를 생성하고 공유하세요',
    type: 'website',
  },
};

export default function QrCodeGeneratorRoute() {
  return <QrCodeGeneratorPage />;
}


