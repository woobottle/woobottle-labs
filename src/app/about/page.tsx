"use client";

import React from "react";
import {
  Info,
  Heart,
  Code,
  Zap,
  Users,
  Award,
  Github,
  Mail,
} from "lucide-react";
import AppLayout from "../../components/AppLayout";

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: "실시간 분석",
      description: "타이핑과 동시에 즉시 글자수와 통계를 확인할 수 있습니다.",
    },
    {
      icon: Code,
      title: "다국어 지원",
      description:
        "한글, 영어를 포함한 다양한 언어의 문자를 정확히 계산합니다.",
    },
    {
      icon: Users,
      title: "사용자 친화적",
      description: "직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.",
    },
    {
      icon: Award,
      title: "고성능",
      description:
        "Next.js와 React를 기반으로 한 빠르고 안정적인 성능을 제공합니다.",
    },
  ];

  const team = [
    {
      name: "WooBottle Labs",
      role: "개발팀",
      description: "생산성 도구 개발에 전념하는 개발팀입니다.",
      avatar: "WB",
    },
  ];

  const FeatureCard = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    description: string;
  }) => (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
      <div className="p-3 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] w-fit mb-4">
        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-[#A3A3A3]">{description}</p>
    </div>
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
            ABOUT
          </div>
          <h1 className="text-3xl font-semibold text-white">정보</h1>
          <p className="mt-2 text-[#A3A3A3]">WooBottle Labs 소개</p>
        </div>

        {/* Header Badge */}
        <div className="mb-10 flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl">
            <Info className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xl text-white">생산성을 높이는 도구들의 모음</p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[#0A0A0A] border border-[#1A1A1A] text-[#A3A3A3] rounded-full text-sm">
              <Award className="w-4 h-4" strokeWidth={1.5} />
              Version 1.0.0
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            프로젝트 소개
          </h2>
          <div className="max-w-none">
            <p className="text-[#A3A3A3] leading-relaxed mb-4">
              WooBottle Labs는 일상과 업무에서 필요한 다양한 생산성 도구들을 한
              곳에 모은 웹 애플리케이션입니다. 글자수 카운터, 계산기, 타이머 등
              자주 사용하는 도구들을 현대적이고 사용하기 편한 인터페이스로
              제공합니다.
            </p>
            <p className="text-[#A3A3A3] leading-relaxed">
              모든 기능은 브라우저에서 바로 실행되며, 별도의 설치나 회원가입
              없이 즉시 사용할 수 있습니다. 사용자의 프라이버시를 보호하기 위해
              모든 데이터는 로컬에서만 처리됩니다.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-8">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">기술 스택</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Next.js", version: "15" },
              { name: "React", version: "19" },
              { name: "TypeScript", version: "5" },
              { name: "Tailwind CSS", version: "3" },
            ].map((tech, index) => (
              <div
                key={index}
                className="text-center p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg"
              >
                <h3 className="font-semibold text-white">{tech.name}</h3>
                <p className="text-sm text-[#A3A3A3]">{tech.version}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">개발팀</h2>
          <div className="grid gap-6">
            {team.map((member, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full flex items-center justify-center text-sm font-semibold text-white">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-[#A3A3A3] text-sm">{member.role}</p>
                  <p className="text-[#A3A3A3] text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Links */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            연락처 및 링크
          </h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:contact@woobottle.com"
              className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded-lg transition-colors duration-150 hover:bg-[#141414]"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
              이메일 문의
            </a>
            <a
              href="https://github.com/woobottle"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded-lg transition-colors duration-150 hover:bg-[#141414]"
            >
              <Github className="w-4 h-4" strokeWidth={1.5} />
              GitHub
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <div className="flex items-center justify-center gap-2 text-[#A3A3A3] mb-4">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-white" strokeWidth={1.5} />
            <span>by WooBottle Labs</span>
          </div>
          <p className="text-sm text-[#525252]">
            © 2024 WooBottle Labs. All rights reserved.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
