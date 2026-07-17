"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";

import { TOOLS } from "entities/tool";

interface ToolPaletteProps {
  open: boolean;
  onClose: () => void;
}

const SELECTABLE_TOOLS = TOOLS.filter((tool) => tool.id !== "home");

export const ToolPalette: React.FC<ToolPaletteProps> = ({ open, onClose }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SELECTABLE_TOOLS;
    return SELECTABLE_TOOLS.filter((tool) => {
      const haystack = `${tool.label} ${tool.id} ${
        tool.description ?? ""
      }`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  // Reset & focus when opening.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Focus after the enter transition begins.
      const t = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Keep the active index in range as results change.
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(results.length - 1, 0)));
  }, [results.length]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const tool = results[activeIndex];
      if (tool) go(tool.href);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24 sm:pt-32"
      role="dialog"
      aria-modal="true"
      aria-label="도구 검색"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <button
        aria-label="닫기"
        onClick={onClose}
        className="animate-palette-fade absolute inset-0 cursor-default bg-black/50 backdrop-blur-2xl"
      />

      {/* Panel */}
      <div className="animate-palette-pop liquid-glass relative z-10 w-full max-w-2xl rounded-3xl">
        {/* Search field */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search size={18} className="shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="도구 검색..."
            className="w-full bg-transparent text-base text-white placeholder:text-gray-500 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded-md border border-white/15 px-1.5 py-0.5 text-[10px] text-gray-400 sm:block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              &quot;{query}&quot; 에 맞는 도구가 없어요.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {results.map((tool, i) => {
                const Icon = tool.icon;
                const isActive = i === activeIndex;
                return (
                  <button
                    key={tool.id}
                    onClick={() => go(tool.href)}
                    onMouseMove={() => setActiveIndex(i)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <Icon
                        size={18}
                        className="text-white"
                        strokeWidth={1.5}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">
                        {tool.label}
                      </span>
                      {tool.description && (
                        <span className="block truncate text-xs text-gray-400">
                          {tool.description}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <CornerDownLeft
                        size={14}
                        className="shrink-0 text-gray-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-white/10 px-5 py-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/15 px-1">↑</kbd>
            <kbd className="rounded border border-white/15 px-1">↓</kbd>
            이동
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/15 px-1">↵</kbd>
            열기
          </span>
          <span className="ml-auto">{results.length}개 도구</span>
        </div>
      </div>
    </div>
  );
};
