"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Wrench, Gift, Zap } from "lucide-react";

import { TOOLS } from "entities/tool";
import { ToolPalette, useCommandShortcut } from "features/tool-palette";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4";

const TOOL_COUNT = TOOLS.filter((tool) => tool.id !== "home").length;

type NavItem = { label: string; href?: string; action?: "palette" };

const NAV_ITEMS: NavItem[] = [
  { label: "도구", action: "palette" },
  { label: "정보", href: "/about" },
];

export const CinematicHero: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => {
    setMenuOpen(false);
    setPaletteOpen(true);
  }, []);

  useCommandShortcut(() => setPaletteOpen((v) => !v));

  return (
    <div className="relative h-screen h-[100dvh] w-full overflow-hidden bg-black text-white">
      {/* Background video (z-0, fixed behind everything) */}
      <video
        className="fixed inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Bottom blur overlay — blur only, no dark gradient (z-1) */}
      <div className="cinematic-blur-overlay pointer-events-none fixed inset-0 z-[1] backdrop-blur-xl" />

      {/* Foreground layout */}
      <div className="relative z-10 flex h-full flex-col">
        {/* ── Navbar ─────────────────────────────────────────── */}
        <nav className="relative z-50 flex items-center justify-between px-4 py-4 sm:px-6 md:px-12 md:py-6">
          {/* Logo */}
          <Link
            href="/"
            className="animate-blur-fade-up flex h-8 items-center text-xl font-semibold tracking-[-0.03em] md:h-10 md:text-2xl"
            style={{ animationDelay: "0ms" }}
          >
            WooBottle&nbsp;Labs
          </Link>

          {/* Center nav links (lg+) */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item, i) => {
              const className =
                "animate-blur-fade-up text-sm transition-colors hover:text-gray-300";
              const style = { animationDelay: `${100 + i * 50}ms` };
              return item.action === "palette" ? (
                <button
                  key={item.label}
                  onClick={openPalette}
                  className={className}
                  style={style}
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={className}
                  style={style}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search pill (sm+) */}
            <button
              onClick={openPalette}
              className="animate-blur-fade-up liquid-glass hidden items-center gap-2 rounded-full px-4 py-2 text-sm sm:flex md:px-6"
              style={{ animationDelay: "350ms" }}
            >
              <span>도구 검색</span>
              <kbd className="hidden rounded border border-white/20 px-1 text-[10px] leading-4 text-gray-300 md:inline">
                ⌘K
              </kbd>
              <Search size={18} />
            </button>

            {/* Hamburger (below lg) */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="animate-blur-fade-up liquid-glass relative flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
              style={{ animationDelay: "350ms" }}
              aria-label="메뉴"
            >
              <Menu
                size={18}
                className={`absolute transition-all duration-500 ease-out ${
                  menuOpen
                    ? "scale-50 rotate-180 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                }`}
              />
              <X
                size={18}
                className={`absolute transition-all duration-500 ease-out ${
                  menuOpen
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-50 rotate-180 opacity-0"
                }`}
              />
            </button>
          </div>
        </nav>

        {/* ── Mobile menu (below lg) ─────────────────────────── */}
        <div
          className={`absolute left-0 right-0 top-[72px] z-40 border-b border-t border-gray-800 bg-gray-900/95 shadow-2xl backdrop-blur-lg transition-all duration-500 ease-out lg:hidden ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col px-4 py-3 sm:px-6">
            {NAV_ITEMS.map((item, i) => {
              const className = `rounded-lg px-3 py-3 text-left transition-all duration-500 ease-out hover:bg-gray-800/50 ${
                menuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`;
              const style = {
                transitionDelay: menuOpen ? `${i * 50}ms` : "0ms",
              };
              return item.action === "palette" ? (
                <button
                  key={item.label}
                  onClick={openPalette}
                  className={className}
                  style={style}
                >
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={className}
                  style={style}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Hero content (bottom of viewport) ──────────────── */}
        <div className="z-10 flex flex-1 flex-col justify-end px-4 pb-8 sm:px-6 md:px-12 md:pb-16">
          <div className="max-w-3xl">
            {/* Metadata row */}
            <div
              className="animate-blur-fade-up mb-6 flex flex-wrap items-center gap-3 text-xs text-gray-300 sm:gap-6 sm:text-sm md:mb-8"
              style={{ animationDelay: "300ms" }}
            >
              <div className="flex items-center gap-2">
                <Wrench size={16} className="sm:h-5 sm:w-5" />
                <span className="font-medium">{TOOL_COUNT}개 도구</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift size={16} />
                <span>완전 무료</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} />
                <span>설치 불필요</span>
              </div>
            </div>

            {/* Title */}
            <h1
              className="animate-blur-fade-up mb-4 text-3xl font-normal leading-[1.05] sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl"
              style={{ animationDelay: "400ms", letterSpacing: "-0.04em" }}
            >
              필요한 도구를
              <br />
              한곳에서.
            </h1>

            {/* Description */}
            <p
              className="animate-blur-fade-up mb-6 max-w-2xl text-base text-gray-400 sm:text-lg md:mb-12 md:text-xl"
              style={{ animationDelay: "500ms" }}
            >
              글자수 카운터부터 뽀모도로 타이머까지 — 설치 없이 브라우저에서
              바로 쓰는 생산성 도구 모음.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={openPalette}
                className="animate-blur-fade-up flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-medium text-black transition-colors hover:bg-gray-200 sm:px-8 sm:py-3"
                style={{ animationDelay: "600ms" }}
              >
                <Search size={18} />
                <span>도구 찾기</span>
                <kbd className="hidden rounded border border-black/20 px-1 text-[10px] leading-4 text-gray-600 sm:inline">
                  ⌘K
                </kbd>
              </button>
              <Link
                href="/about"
                className="animate-blur-fade-up liquid-glass rounded-full px-6 py-2.5 font-medium sm:px-8 sm:py-3"
                style={{ animationDelay: "700ms" }}
              >
                정보
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tool command palette (⌘K / Search) */}
      <ToolPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
};
