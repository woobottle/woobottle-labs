'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hash, Menu, Search, Star, X } from 'lucide-react';

import { TOOLS } from 'entities/tool';
import { useToolFavorites } from 'features/tool-favorites';
import { ThemeToggle } from 'shared/ui/theme-toggle';
import { Input } from 'shared/ui/input';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const { favoritesSet, toggleFavorite } = useToolFavorites();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
          w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
          ${isActive
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-[1.02]'
            : 'text-gray-700 hover:bg-white/60 hover:shadow-md dark:text-gray-300 dark:hover:bg-gray-800/60'
          }
        `}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className={`
            p-2 rounded-lg transition-colors duration-200
            ${isActive
              ? 'bg-white/20'
              : 'bg-gray-100 dark:bg-gray-800'
            }
          `}>
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
          </div>
          <div className="min-w-0 text-left">
            <p className={`truncate font-medium ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
              {item.label}
            </p>
            {item.description && (
              <p className={`truncate text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.description}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 등록'}
          title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 등록'}
          className={`
            flex h-8 w-8 items-center justify-center rounded-lg transition-colors
            ${isActive ? 'hover:bg-white/15' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
          `}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
        >
          <Star
            className={`
              h-4 w-4
              ${isActive ? 'text-white' : isFavorite ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'}
            `}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/90 transition-all duration-200 dark:bg-gray-800/80 dark:border-gray-700/30 dark:hover:bg-gray-700/90"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 w-64 h-[100dvh] bg-white/90 backdrop-blur-lg border-r border-white/30 shadow-xl z-40
        dark:bg-gray-900/90 dark:border-gray-700/30
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">WooBottle</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">생산성 도구</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto overscroll-contain p-4">
          <div className="sticky top-0 z-10 mb-4 rounded-xl bg-white/90 pb-3 backdrop-blur-lg dark:bg-gray-900/90">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="도구 검색…"
                className="px-3 py-2 pl-9 text-sm"
              />
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              검색 결과가 없어요.
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteTools.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <Star className="h-3.5 w-3.5" />
                    즐겨찾기
                  </div>
                  <div className="space-y-2">
                    {favoriteTools.map(renderToolLink)}
                  </div>
                </div>
              )}

              {otherTools.length > 0 && (
                <div>
                  {favoriteTools.length > 0 && (
                    <div className="mb-2 px-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      전체
                    </div>
                  )}
                  <div className="space-y-2">
                    {otherTools.map(renderToolLink)}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50">
          {/* Theme Toggle */}
          <div className="p-4">
            <ThemeToggle />
          </div>

          {/* Footer */}
          <div className="px-4 pb-4">
            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
              <p>Version 1.0.0</p>
              <p className="mt-1">© 2024 WooBottle Labs</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
