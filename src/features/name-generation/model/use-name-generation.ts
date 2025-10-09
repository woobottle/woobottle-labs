'use client';

import { useState, useCallback } from 'react';
import {
  NameGenerationOptions,
  GeneratedName,
  generateNameCombinations,
  getNameSuggestions
} from 'entities/name';

export const useNameGeneration = () => {
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<NameGenerationOptions>({
    gender: 'unisex',
    country: 'korea',
    includeMeaning: true,
    popularityRange: { min: 1, max: 10 }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const generateNames = useCallback(async (count: number = 10) => {
    setIsGenerating(true);

    try {
      // 비동기 처리로 자연스러운 UX 제공
      await new Promise(resolve => setTimeout(resolve, 500));

      let names;

      if (searchQuery.trim()) {
        // 검색어가 있으면 유사 이름 추천
        names = getNameSuggestions(searchQuery.trim(), options, count);
      } else {
        // 랜덤 이름 생성
        names = generateNameCombinations(options, count);
      }

      const generated: GeneratedName[] = names.map((name) => ({
        name: name.name,
        gender: name.gender,
        country: name.country,
        meaning: options.includeMeaning ? name.meaning : undefined,
        syllables: name.syllables,
        origin: name.origin,
        score: Math.round((name.popularity + Math.random() * 2) * 10) / 10 // 1-10 사이 랜덤 점수
      }));

      setGeneratedNames(generated);
    } catch (error) {
      console.error('이름 생성 중 오류 발생:', error);
      setGeneratedNames([]);
    } finally {
      setIsGenerating(false);
    }
  }, [options, searchQuery]);

  const updateOptions = useCallback((newOptions: Partial<NameGenerationOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites(prev =>
      prev.includes(name)
        ? prev.filter(fav => fav !== name)
        : [...prev, name]
    );
  }, []);

  const clearNames = useCallback(() => {
    setGeneratedNames([]);
  }, []);

  const regenerateNames = useCallback(() => {
    generateNames();
  }, [generateNames]);

  return {
    generatedNames,
    isGenerating,
    options,
    searchQuery,
    favorites,
    setSearchQuery,
    generateNames,
    updateOptions,
    toggleFavorite,
    clearNames,
    regenerateNames,
  };
};
