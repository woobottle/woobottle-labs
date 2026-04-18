"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LandingLayout } from "widgets/landing-layout";
import { LandingHero } from "widgets/landing-hero";
import { TOOLS } from "entities/tool";
import type { Tool } from "entities/tool";

const ToolCard = ({ tool }: { tool: Tool }) => {
  const Icon = tool.icon;

  return (
    <Link href={tool.href} className="group block">
      <div className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-6 transition-colors duration-150 hover:border-[#2A2A2A]">
        <Icon className="w-6 h-6 text-white mb-6" strokeWidth={1.5} />
        <h3 className="text-xl font-semibold text-white mb-2">{tool.label}</h3>
        {tool.description && (
          <p className="text-sm text-[#A3A3A3] mb-6">{tool.description}</p>
        )}
        <ArrowRight
          className="w-4 h-4 text-[#525252] transition-colors duration-150 group-hover:text-white"
          strokeWidth={1.5}
        />
      </div>
    </Link>
  );
};

export const HomePage: React.FC = () => {
  const tools = TOOLS.filter((tool) => tool.id !== "home");

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
