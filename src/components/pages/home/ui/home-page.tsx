'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Clock,
  FileText,
  Home,
  Image as ImageIcon,
  Info,
  Settings,
  Smartphone,
} from 'lucide-react';

import { LandingLayout } from 'widgets/landing-layout';
import { VisionOsHeroCanvas, type VisionOsHeroOrb } from 'widgets/visionos-hero';

const tools = [
  {
    id: 'text-counter',
    title: '글자수 카운터',
    description: '실시간으로 글자, 단어, 줄 수를 계산합니다',
    icon: FileText,
    href: '/text-counter',
    color: 'from-blue-500 to-blue-600',
    stats: '실시간 분석',
  },
  {
    id: 'calculator',
    title: '계산기',
    description: '간단한 사칙연산을 수행할 수 있습니다',
    icon: Calculator,
    href: '/calculator',
    color: 'from-green-500 to-green-600',
    stats: '사칙연산',
  },
  {
    id: 'area-converter',
    title: '평수 변환기',
    description: '아파트 평수를 제곱미터로, 제곱미터를 평수로 변환합니다',
    icon: Home,
    href: '/area-converter',
    color: 'from-teal-500 to-teal-600',
    stats: '부동산 전문',
  },
  {
    id: 'icon-generator',
    title: '아이콘 생성기',
    description: '하나의 이미지로 모든 플랫폼용 아이콘을 생성합니다',
    icon: Smartphone,
    href: '/icon-generator',
    color: 'from-pink-500 to-pink-600',
    stats: 'iOS/Android/Web',
  },
  {
    id: 'image-resizer',
    title: '이미지 리사이저',
    description: '이미지를 업로드하고 원하는 크기로 조절하세요',
    icon: ImageIcon,
    href: '/image-resizer',
    color: 'from-orange-500 to-orange-600',
    stats: '크기 조절',
  },
  {
    id: 'statistics',
    title: '통계 분석',
    description: '상세한 텍스트 및 사용 통계를 확인하세요',
    icon: BarChart3,
    href: '/statistics',
    color: 'from-purple-500 to-purple-600',
    stats: '데이터 시각화',
  },
  {
    id: 'timer',
    title: '뽀모도로 타이머',
    description: '집중력을 높이고 생산성을 향상시키는 시간 관리 기법',
    icon: Clock,
    href: '/timer',
    color: 'from-red-500 to-pink-600',
    stats: '집중력 향상',
  },
  {
    id: 'settings',
    title: '설정',
    description: '앱 환경을 원하는 대로 설정하세요',
    icon: Settings,
    href: '/settings',
    color: 'from-gray-500 to-gray-600',
    stats: '개인화',
  },
  {
    id: 'about',
    title: '정보',
    description: '앱에 대한 자세한 정보를 확인하세요',
    icon: Info,
    href: '/about',
    color: 'from-indigo-500 to-indigo-600',
    stats: '프로젝트 소개',
  },
] as const;

const ToolCard = ({ tool }: { tool: (typeof tools)[number] }) => {
  const Icon = tool.icon;

  return (
    <Link href={tool.href} className="group">
      <div className="relative overflow-hidden rounded-2xl border border-white/30 bg-white/75 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-xl group-hover:scale-[1.01] dark:border-gray-700/40 dark:bg-gray-900/60">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-80 dark:from-white/10" />

        <div className="relative">
          <div className="mb-4 flex items-start justify-between">
            <div className={`rounded-xl bg-gradient-to-br ${tool.color} p-3 shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-200" />
          </div>

          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{tool.title}</h3>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>

          <div className="flex items-center justify-between">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {tool.stats}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const HomePage: React.FC = () => {
  const heroOrbs = tools.map(
    (tool): VisionOsHeroOrb => ({
      id: tool.id,
      Icon: tool.icon,
      label: tool.title,
      href: tool.href,
      colorClassName: `bg-gradient-to-br ${tool.color}`,
    }),
  );

  return (
    <LandingLayout>
      <VisionOsHeroCanvas
        orbs={heroOrbs}
        actions={
          <>
            <a
              href="#tools"
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              도구 둘러보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </>
        }
      />

      
    </LandingLayout>
  );
};


