import { AreaConverterPage } from 'components/pages/area-converter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '아파트 평수 변환기 | WooBottle Labs',
  description: '평수를 제곱미터로, 제곱미터를 평수로 간편하게 변환하는 도구입니다. 정확한 법정 변환 계수를 사용하여 신뢰할 수 있는 결과를 제공합니다.',
  keywords: ['평수 변환', '제곱미터 변환', '아파트 평수', '부동산 면적', '평수 계산기'],
  openGraph: {
    title: '아파트 평수 변환기',
    description: '평수와 제곱미터를 상호 변환하는 간편한 도구',
    type: 'website',
  },
};

export default function AreaConverterRoute() {
  return <AreaConverterPage />;
}
