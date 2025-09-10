import { CurrencyConverterPage } from 'components/pages/currency-converter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '환율 변환기 | WooBottle Labs',
  description: '공개 환율 API를 사용하여 다양한 통화 간 금액을 빠르게 변환하세요.',
  keywords: ['환율 변환기', '통화 변환', 'Currency Converter', 'Exchange Rates'],
  openGraph: {
    title: '환율 변환기',
    description: '실시간 환율로 통화 변환',
    type: 'website',
  },
};

export default function CurrencyConverterRoute() {
  return <CurrencyConverterPage />;
}


