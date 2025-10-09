import { NameData, NameGenerationOptions } from 'entities/name';

export const calculateNameScore = (name: NameData, options: NameGenerationOptions): number => {
  let score = name.popularity;

  // 성별 선호도 가중치
  if (name.gender === options.gender) {
    score += 1;
  } else if (name.gender === 'unisex') {
    score += 0.5;
  }

  // 음절 수 선호도
  if (options.syllablePreference && name.syllables === options.syllablePreference) {
    score += 2;
  }

  // 인기도 범위 내에 있는지
  if (options.popularityRange) {
    const { min, max } = options.popularityRange;
    if (name.popularity >= min && name.popularity <= max) {
      score += 1;
    }
  }

  // 랜덤 요소 추가
  score += Math.random() * 2 - 1; // -1 ~ +1 사이 랜덤

  return Math.max(1, Math.min(10, score));
};

export const enhanceNameWithMeaning = (name: NameData): string => {
  if (name.meaning) {
    return name.meaning;
  }

  // 기본 의미 생성 (실제로는 더 풍부한 데이터베이스 필요)
  const defaultMeanings: Record<string, string> = {
    '민준': '민중을 준수하다',
    '서연': '서쪽의 연꽃',
    '지우': '지혜롭고 우아하다',
    'James': '대체자, 승리자',
    'Emma': '보편적인, 전 세계적인',
    'Wei': '위대한, 강력한',
  };

  return defaultMeanings[name.name] || '아름다운 의미를 가진 이름';
};

export const generateNameVariations = (baseName: string, count: number = 3): string[] => {
  const variations: string[] = [];

  // 간단한 변형 생성 (실제로는 더 정교한 알고리즘 필요)
  const prefixes = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const suffixes = ['준', '우', '현', '민', '서', '연', '지', '수', '영', '진'];

  for (let i = 0; i < count; i++) {
    if (Math.random() > 0.5) {
      // 접두사 추가
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      variations.push(`${prefix}${baseName}`);
    } else {
      // 접미사 추가
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      variations.push(`${baseName}${suffix}`);
    }
  }

  return variations;
};

export const validateGenerationOptions = (options: NameGenerationOptions): boolean => {
  // 옵션 유효성 검증
  if (!options.gender || !options.country) {
    return false;
  }

  if (options.popularityRange) {
    const { min, max } = options.popularityRange;
    if (min < 1 || max > 10 || min > max) {
      return false;
    }
  }

  if (options.syllablePreference && (options.syllablePreference < 1 || options.syllablePreference > 5)) {
    return false;
  }

  return true;
};

export const getNameTrends = (country: string): { trend: string; description: string }[] => {
  // 국가별 이름 트렌드 (실제로는 데이터 기반)
  const trends: Record<string, { trend: string; description: string }[]> = {
    korea: [
      { trend: '자연 친화적', description: '하늘, 바다, 숲 등 자연을 연상시키는 이름' },
      { trend: '단순하고 강한', description: '짧고 임팩트 있는 이름 선호' },
      { trend: '의미 있는', description: '좋은 의미를 가진 한자 이름' }
    ],
    usa: [
      { trend: '클래식 재해석', description: '전통적인 이름을 현대적으로 변형' },
      { trend: '자연 영감', description: '자연 현상에서 영감을 받은 이름' },
      { trend: '문화 융합', description: '다양한 문화에서 온 이름' }
    ],
    china: [
      { trend: '행운의 의미', description: '행운과 번영을 상징하는 이름' },
      { trend: '강한 인상', description: '힘과 리더십을 나타내는 이름' },
      { trend: '전통 보존', description: '가문의 전통을 이어받은 이름' }
    ]
  };

  return trends[country] || trends.korea;
};
