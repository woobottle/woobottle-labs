import type { Metadata } from 'next';
import { HomePage } from 'components/pages/home';

export const metadata: Metadata = {
  title: 'WooBottle Labs | 생산성 도구 모음',
  description: '글자수 카운터, 계산기, 평수/환율 변환, 아이콘 생성 등 다양한 웹 도구를 한 곳에서 제공합니다.',
  openGraph: {
    title: 'WooBottle Labs',
    description: '일상과 업무에 필요한 생산성 도구 모음',
    type: 'website',
  },
};

export default function HomeRoute() {
  return <HomePage />;
}