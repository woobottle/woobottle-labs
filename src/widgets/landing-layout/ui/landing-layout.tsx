"use client";

import React from "react";
import Link from "next/link";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-[#1A1A1A] bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl border border-white"
              aria-hidden="true"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold">WooBottle Labs</div>
              <div className="text-xs text-[#525252]">Productivity tools</div>
            </div>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-[#A3A3A3]">
            <Link href="/" className="transition-colors hover:text-white">
              도구
            </Link>
            <a href="/apps/" className="transition-colors hover:text-white">
              앱
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        {children}
      </main>
    </div>
  );
};
