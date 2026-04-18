"use client";

import React from "react";
import Link from "next/link";
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
} from "lucide-react";

import { LandingLayout } from "widgets/landing-layout";
import { LandingHero } from "widgets/landing-hero";

const tools = [
  {
    id: "text-counter",
    title: "글자수 카운터",
    description: "실시간으로 글자, 단어, 줄 수를 계산합니다",
    icon: FileText,
    href: "/text-counter",
    stats: "실시간 분석",
  },
  {
    id: "calculator",
    title: "계산기",
    description: "간단한 사칙연산을 수행할 수 있습니다",
    icon: Calculator,
    href: "/calculator",
    stats: "사칙연산",
  },
  {
    id: "area-converter",
    title: "평수 변환기",
    description: "아파트 평수를 제곱미터로, 제곱미터를 평수로 변환합니다",
    icon: Home,
    href: "/area-converter",
    stats: "부동산 전문",
  },
  {
    id: "icon-generator",
    title: "아이콘 생성기",
    description: "하나의 이미지로 모든 플랫폼용 아이콘을 생성합니다",
    icon: Smartphone,
    href: "/icon-generator",
    stats: "iOS / Android / Web",
  },
  {
    id: "image-resizer",
    title: "이미지 리사이저",
    description: "이미지를 업로드하고 원하는 크기로 조절하세요",
    icon: ImageIcon,
    href: "/image-resizer",
    stats: "크기 조절",
  },
  {
    id: "statistics",
    title: "통계 분석",
    description: "상세한 텍스트 및 사용 통계를 확인하세요",
    icon: BarChart3,
    href: "/statistics",
    stats: "데이터 시각화",
  },
  {
    id: "timer",
    title: "뽀모도로 타이머",
    description: "집중력을 높이고 생산성을 향상시키는 시간 관리 기법",
    icon: Clock,
    href: "/timer",
    stats: "집중력 향상",
  },
  {
    id: "settings",
    title: "설정",
    description: "앱 환경을 원하는 대로 설정하세요",
    icon: Settings,
    href: "/settings",
    stats: "개인화",
  },
  {
    id: "about",
    title: "정보",
    description: "앱에 대한 자세한 정보를 확인하세요",
    icon: Info,
    href: "/about",
    stats: "프로젝트 소개",
  },
] as const;

const ToolCard = ({ tool }: { tool: (typeof tools)[number] }) => {
  const Icon = tool.icon;

  return (
    <Link href={tool.href} className="group block">
      <div className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-6 transition-colors duration-150 hover:border-[#2A2A2A]">
        <Icon className="w-6 h-6 text-white mb-6" strokeWidth={1.5} />
        <h3 className="text-xl font-semibold text-white mb-2">{tool.title}</h3>
        <p className="text-sm text-[#A3A3A3] mb-6">{tool.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#525252] uppercase tracking-wide">
            {tool.stats}
          </span>
          <ArrowRight
            className="w-4 h-4 text-[#525252] transition-colors duration-150 group-hover:text-white"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </Link>
  );
};

export const HomePage: React.FC = () => {
  return (
    <LandingLayout>
      <LandingHero />

      <section id="tools" className="py-16">
        <div className="mb-10">
          <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
            TOOLS
          </div>
          <h2 className="text-3xl font-semibold text-white">전체 도구</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </LandingLayout>
  );
};
