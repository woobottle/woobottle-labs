'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Calculator, BarChart3, Clock, Settings, Info, ArrowRight, Smartphone, Home, Image } from 'lucide-react';
import AppLayout from '../components/AppLayout';

export default function HomePage() {
  const tools = [
    {
      id: 'text-counter',
      title: '글자수 카운터',
      description: '실시간으로 글자, 단어, 줄 수를 계산합니다',
      icon: FileText,
      href: '/text-counter',
      color: 'from-blue-500 to-blue-600',
      stats: '실시간 분석'
    },
    {
      id: 'calculator',
      title: '계산기',
      description: '간단한 사칙연산을 수행할 수 있습니다',
      icon: Calculator,
      href: '/calculator',
      color: 'from-green-500 to-green-600',
      stats: '사칙연산'
    },
    {
      id: 'area-converter',
      title: '평수 변환기',
      description: '아파트 평수를 제곱미터로, 제곱미터를 평수로 변환합니다',
      icon: Home,
      href: '/area-converter',
      color: 'from-teal-500 to-teal-600',
      stats: '부동산 전문'
    },
    {
      id: 'icon-generator',
      title: '아이콘 생성기',
      description: '하나의 이미지로 모든 플랫폼용 아이콘을 생성합니다',
      icon: Smartphone,
      href: '/icon-generator',
      color: 'from-pink-500 to-pink-600',
      stats: 'iOS/Android/Web'
    },
    {
      id: 'image-resizer',
      title: '이미지 리사이저',
      description: '이미지를 업로드하고 원하는 크기로 조절하세요',
      icon: Image,
      href: '/image-resizer',
      color: 'from-orange-500 to-orange-600',
      stats: '크기 조절'
    },
    {
      id: 'statistics',
      title: '통계 분석',
      description: '상세한 텍스트 및 사용 통계를 확인하세요',
      icon: BarChart3,
      href: '/statistics',
      color: 'from-purple-500 to-purple-600',
      stats: '데이터 시각화'
    },
    {
      id: 'timer',
      title: '뽀모도로 타이머',
      description: '집중력을 높이고 생산성을 향상시키는 시간 관리 기법',
      icon: Clock,
      href: '/timer',
      color: 'from-red-500 to-pink-600',
      stats: '집중력 향상'
    },
    {
      id: 'settings',
      title: '설정',
      description: '앱 환경을 원하는 대로 설정하세요',
      icon: Settings,
      href: '/settings',
      color: 'from-gray-500 to-gray-600',
      stats: '개인화'
    },
    {
      id: 'about',
      title: '정보',
      description: '앱에 대한 자세한 정보를 확인하세요',
      icon: Info,
      href: '/about',
      color: 'from-indigo-500 to-indigo-600',
      stats: '프로젝트 소개'
    }
  ];

  const ToolCard = ({ tool }: { tool: typeof tools[0] }) => {
    const Icon = tool.icon;
    
    return (
      <Link href={tool.href} className="group">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{tool.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{tool.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {tool.stats}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          WooBottle Labs
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          일상과 업무에서 필요한 다양한 생산성 도구들을 한 곳에서 만나보세요. 
          간단하고 직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm font-medium">온라인</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
            <span className="text-sm font-medium">무료 사용</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
            <span className="text-sm font-medium">설치 불필요</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 text-center dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="text-3xl font-bold text-blue-600 mb-2">9</div>
          <p className="text-gray-600 dark:text-gray-300">생산성 도구</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 text-center dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="text-3xl font-bold text-green-600 mb-2">0</div>
          <p className="text-gray-600 dark:text-gray-300">설치 과정</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 text-center dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
          <p className="text-gray-600 dark:text-gray-300">무료 사용</p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
          사용 가능한 도구들
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 dark:bg-gray-800/80 dark:border-gray-700/30">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          왜 WooBottle Labs인가요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">빠른 접근</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">즉시 사용 가능한 도구들</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">프라이버시</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">모든 데이터 로컬 처리</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">반응형</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">모든 기기에서 완벽 동작</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">모던 UI</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">직관적이고 세련된 디자인</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}