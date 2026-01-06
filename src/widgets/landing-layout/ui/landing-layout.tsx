'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ThemeToggle } from 'shared/ui/theme-toggle';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-neutral-100 text-gray-900 transition-colors dark:bg-black dark:text-gray-100">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/40 backdrop-blur-lg dark:border-white/10 dark:bg-black/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">WooBottle Labs</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">Productivity tools</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
};




