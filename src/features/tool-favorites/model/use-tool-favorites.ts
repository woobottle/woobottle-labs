'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'woobottle:favorites:tools';

const readFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
};

const writeFavorites = (favorites: string[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const useToolFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readFavorites());

  useEffect(() => {
    // 다른 탭에서 동기화 (best-effort)
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setFavoriteIds(readFavorites());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    writeFavorites(favoriteIds);
  }, [favoriteIds]);

  const isFavorite = useCallback(
    (toolId: string) => favoriteIds.includes(toolId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback((toolId: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(toolId)) return prev.filter((id) => id !== toolId);
      return [...prev, toolId];
    });
  }, []);

  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  return {
    favoriteIds,
    favoritesSet,
    isFavorite,
    toggleFavorite,
  };
};



