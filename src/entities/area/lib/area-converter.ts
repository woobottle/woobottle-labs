import type { AreaInfo } from '../model/types';

// 1평 = 3.3058 제곱미터 (정확한 변환 계수)
export const PYEONG_TO_SQM_RATIO = 3.3058;

/**
 * 평수를 제곱미터로 변환
 */
export function pyeongToSquareMeters(pyeong: number): number {
  if (pyeong < 0) return 0;
  return pyeong * PYEONG_TO_SQM_RATIO;
}

/**
 * 제곱미터를 평수로 변환
 */
export function squareMetersToPyeong(squareMeters: number): number {
  if (squareMeters < 0) return 0;
  return squareMeters / PYEONG_TO_SQM_RATIO;
}

/**
 * 평수 입력값 검증 및 변환
 */
export function validatePyeongInput(input: string): AreaInfo {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return {
      pyeong: 0,
      squareMeters: 0,
      isValid: false,
      error: '평수를 입력해주세요.'
    };
  }

  const pyeong = parseFloat(trimmed);
  
  if (isNaN(pyeong)) {
    return {
      pyeong: 0,
      squareMeters: 0,
      isValid: false,
      error: '유효한 숫자를 입력해주세요.'
    };
  }

  if (pyeong < 0) {
    return {
      pyeong: 0,
      squareMeters: 0,
      isValid: false,
      error: '음수는 입력할 수 없습니다.'
    };
  }

  if (pyeong > 1000) {
    return {
      pyeong,
      squareMeters: pyeongToSquareMeters(pyeong),
      isValid: false,
      error: '1000평을 초과할 수 없습니다.'
    };
  }

  return {
    pyeong,
    squareMeters: pyeongToSquareMeters(pyeong),
    isValid: true
  };
}

/**
 * 제곱미터 입력값 검증 및 변환
 */
export function validateSquareMetersInput(input: string): AreaInfo {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return {
      pyeong: 0,
      squareMeters: 0,
      isValid: false,
      error: '제곱미터를 입력해주세요.'
    };
  }

  const squareMeters = parseFloat(trimmed);
  
  if (isNaN(squareMeters)) {
    return {
      pyeong: 0,
      squareMeters: 0,
      isValid: false,
      error: '유효한 숫자를 입력해주세요.'
    };
  }

  if (squareMeters < 0) {
    return {
      pyeong: 0,
      squareMeters: 0,
      isValid: false,
      error: '음수는 입력할 수 없습니다.'
    };
  }

  if (squareMeters > 3306) { // 1000평 ≈ 3306㎡
    return {
      pyeong: squareMetersToPyeong(squareMeters),
      squareMeters,
      isValid: false,
      error: '3306㎡를 초과할 수 없습니다.'
    };
  }

  return {
    pyeong: squareMetersToPyeong(squareMeters),
    squareMeters,
    isValid: true
  };
}

/**
 * 숫자를 소수점 둘째 자리까지 포맷팅
 */
export function formatAreaValue(value: number): string {
  return value.toFixed(2);
}
