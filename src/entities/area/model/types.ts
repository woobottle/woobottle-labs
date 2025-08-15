export interface AreaConversion {
  pyeong: number;
  squareMeters: number;
  type: 'pyeong_to_sqm' | 'sqm_to_pyeong';
}

export interface AreaInfo {
  pyeong: number;
  squareMeters: number;
  isValid: boolean;
  error?: string;
}

// 평수별 일반적인 아파트 유형
export const APARTMENT_TYPES = [
  { pyeong: 10, description: '소형 원룸/오피스텔' },
  { pyeong: 15, description: '원룸/오피스텔' },
  { pyeong: 20, description: '소형 투룸' },
  { pyeong: 25, description: '중형 투룸' },
  { pyeong: 30, description: '소형 쓰리룸' },
  { pyeong: 35, description: '중형 쓰리룸' },
  { pyeong: 40, description: '대형 쓰리룸' },
  { pyeong: 50, description: '소형 포룸' },
  { pyeong: 60, description: '중형 포룸' },
  { pyeong: 80, description: '대형 포룸' },
] as const;
