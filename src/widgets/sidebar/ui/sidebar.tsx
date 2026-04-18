"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Star, X } from "lucide-react";

import { TOOLS } from "entities/tool";
import { useToolFavorites } from "features/tool-favorites";
import { Input } from "shared/ui/input";

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const { favoritesSet, toggleFavorite } = useToolFavorites();

  const toggleSidebar = () => setIsOpen((v) => !v);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTools = TOOLS.filter((tool) => {
    if (!normalizedQuery) return true;
    return (
      tool.label.toLowerCase().includes(normalizedQuery) ||
      tool.href.toLowerCase().includes(normalizedQuery) ||
      (tool.description?.toLowerCase().includes(normalizedQuery) ?? false)
    );
  });

  const favoriteTools = filteredTools.filter((t) => favoritesSet.has(t.id));
  const otherTools = filteredTools.filter((t) => !favoritesSet.has(t.id));

  const renderToolLink = (item: (typeof TOOLS)[number]) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    const isFavorite = favoritesSet.has(item.id);

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={`
          relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
          transition-colors duration-150
          ${
            isActive
              ? "bg-[#0A0A0A] text-white border-l-2 border-white pl-[10px]"
              : "text-[#A3A3A3] hover:bg-[#0A0A0A] hover:text-white"
          }
        `}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Icon
            className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#A3A3A3]"}`}
            strokeWidth={1.5}
          />
          <div className="min-w-0 text-left">
            <p
              className={`truncate text-sm font-medium ${isActive ? "text-white" : ""}`}
            >
              {item.label}
            </p>
            {item.description && (
              <p className="truncate text-xs text-[#525252]">
                {item.description}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 등록"}
          title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 등록"}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#1A1A1A]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
        >
          <Star
            className={`h-4 w-4 ${isFavorite ? "text-white" : "text-[#525252]"}`}
            fill={isFavorite ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black border border-[#1A1A1A] text-white transition-colors duration-150 hover:border-[#2A2A2A]"
        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
      >
        {isOpen ? (
          <X className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        )}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed left-0 top-0 w-64 h-[100dvh] bg-black border-r border-[#1A1A1A] z-40
          flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-[#1A1A1A] flex-shrink-0">
          <Link href="/" className="block" onClick={() => setIsOpen(false)}>
            <div className="text-base font-bold tracking-tight">WOOBOTTLE</div>
            <div className="text-xs text-[#525252] uppercase tracking-[0.2em]">
              Labs
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain p-4">
          <div className="sticky top-0 z-10 mb-4 bg-black pb-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#525252]"
                strokeWidth={1.5}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="도구 검색…"
                className="px-3 py-2 pl-9 text-sm"
              />
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#1A1A1A] p-4 text-sm text-[#525252]">
              검색 결과가 없어요.
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteTools.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-1 text-xs uppercase tracking-wide text-[#525252]">
                    <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                    즐겨찾기
                  </div>
                  <div className="space-y-1">
                    {favoriteTools.map(renderToolLink)}
                  </div>
                </div>
              )}

              {otherTools.length > 0 && (
                <div>
                  {favoriteTools.length > 0 && (
                    <div className="mb-2 px-1 text-xs uppercase tracking-wide text-[#525252]">
                      전체
                    </div>
                  )}
                  <div className="space-y-1">
                    {otherTools.map(renderToolLink)}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="flex-shrink-0 border-t border-[#1A1A1A]">
          <div className="px-4 py-4 text-center text-xs text-[#525252]">
            <p>v1.0.0</p>
            <p className="mt-1">© 2024 WooBottle Labs</p>
          </div>
        </div>
      </div>
    </>
  );
};
