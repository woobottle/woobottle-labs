export type Gender = 'male' | 'female' | 'unisex';

export type Country = 'korea' | 'usa' | 'china' | 'japan' | 'europe';

export interface NameData {
  id: string;
  name: string;
  gender: Gender;
  country: Country;
  meaning?: string;
  popularity: number; // 1-10 scale
  syllables: number;
  origin: string;
}

export interface NameGenerationOptions {
  gender: Gender;
  country: Country;
  syllablePreference?: number;
  includeMeaning?: boolean;
  popularityRange?: {
    min: number;
    max: number;
  };
}

export interface GeneratedName {
  name: string;
  gender: Gender;
  country: Country;
  meaning?: string;
  syllables: number;
  origin: string;
  score: number; // 생성 점수
}
