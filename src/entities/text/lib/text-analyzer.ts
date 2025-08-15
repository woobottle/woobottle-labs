import type { TextStats } from '../model/types';

export const analyzeText = (text: string): TextStats => {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // Korean character detection (Hangul range)
  const koreanChars = (text.match(/[\u3131-\u3163\uac00-\ud7af]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  
  // Word counting - considering Korean spacing
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  
  // Line counting
  const lines = text === '' ? 0 : text.split('\n').length;
  
  // Paragraph counting
  const paragraphs = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).filter(p => p.trim()).length;

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    koreanChars,
    englishChars
  };
};

export const getCharacterLimitColor = (count: number): string => {
  if (count < 100) return 'text-gray-600';
  if (count < 500) return 'text-blue-600';
  if (count < 1000) return 'text-green-600';
  if (count < 2000) return 'text-amber-600';
  return 'text-red-600';
};
