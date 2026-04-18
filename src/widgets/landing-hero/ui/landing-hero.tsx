"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LandingHeroProps {
  primaryHref?: string;
  secondaryHref?: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  primaryHref = "#tools",
  secondaryHref = "/text-counter",
}) => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-16">
      <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-6">
        WOOBOTTLE LABS
      </div>
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
        일상과 업무를 위한
        <br />
        작은 도구들.
      </h1>
      <p className="text-lg text-[#A3A3A3] max-w-xl mb-10">
        글자수 카운터부터 뽀모도로 타이머까지,
        <br />
        생산성을 한 곳에서.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={primaryHref}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors duration-150 hover:bg-neutral-200"
        >
          도구 둘러보기
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </a>
        <Link
          href={secondaryHref}
          className="inline-flex items-center rounded-lg border border-[#2A2A2A] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:border-white"
        >
          글자수 카운터
        </Link>
      </div>
    </section>
  );
};
