import { NameData, NameGenerationOptions } from '../model/types';
import { nameDatabase } from './name-database';

export const countSyllables = (name: string): number => {
  // 간단한 음절 계산 (실제로는 더 복잡한 로직 필요)
  return name.length > 3 ? Math.ceil(name.length / 2) : 1;
};

export const validateName = (name: string): boolean => {
  // 이름 유효성 검증
  return name.length >= 1 && name.length <= 20 && /^[a-zA-Z가-힣\s]+$/.test(name);
};

export const combineNames = (firstName: string, lastName: string): string => {
  // 한국어는 성 + 이름, 영어는 이름 + 성
  if (/[가-힣]/.test(firstName) || /[가-힣]/.test(lastName)) {
    return `${lastName}${firstName}`;
  }
  return `${firstName} ${lastName}`;
};

export const filterNamesByOptions = (
  names: NameData[],
  options: NameGenerationOptions
): NameData[] => {
  return names.filter(name => {
    // 성별 필터링
    if (name.gender !== options.gender && name.gender !== 'unisex') {
      return false;
    }

    // 국가 필터링
    if (name.country !== options.country) {
      return false;
    }

    // 음절 수 선호도
    if (options.syllablePreference && name.syllables !== options.syllablePreference) {
      return false;
    }

    // 인기도 범위
    if (options.popularityRange) {
      const { min, max } = options.popularityRange;
      if (name.popularity < min || name.popularity > max) {
        return false;
      }
    }

    return true;
  });
};

export const getRandomFromArray = <T>(array: T[], count: number = 1): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

export const generateNameCombinations = (
  options: NameGenerationOptions,
  count: number = 5
): NameData[] => {
  const candidates = filterNamesByOptions(nameDatabase, options);

  if (candidates.length === 0) {
    // 옵션에 맞는 이름이 없으면 더 넓은 범위로 검색
    const fallbackCandidates = nameDatabase.filter(name =>
      name.gender === options.gender || name.gender === 'unisex'
    );
    return getRandomFromArray(fallbackCandidates, count);
  }

  return getRandomFromArray(candidates, count);
};

export const getNameSuggestions = (
  baseName: string,
  options: NameGenerationOptions,
  count: number = 5
): NameData[] => {
  // 입력된 이름과 비슷한 이름들 추천
  const similarNames = nameDatabase.filter(name =>
    name.name.toLowerCase().includes(baseName.toLowerCase()) ||
    baseName.toLowerCase().includes(name.name.toLowerCase())
  );

  const filteredSimilar = filterNamesByOptions(similarNames, options);
  const additionalSuggestions = generateNameCombinations(options, count - filteredSimilar.length);

  return [...filteredSimilar, ...additionalSuggestions].slice(0, count);
};
