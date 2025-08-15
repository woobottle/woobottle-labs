'use client';

import React from 'react';
import { Input } from 'shared/ui/input';
import { Button } from 'shared/ui/button';
import { APARTMENT_TYPES } from 'entities/area';
import { useAreaConversion } from '../model/use-area-conversion';

export const AreaConverter: React.FC = () => {
  const {
    pyeongInput,
    squareMetersInput,
    pyeongResult,
    squareMetersResult,
    setPyeongInput,
    setSquareMetersInput,
    clearAll,
    swapValues,
  } = useAreaConversion();

  const handlePyeongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPyeongInput(e.target.value);
  };

  const handleSquareMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSquareMetersInput(e.target.value);
  };

  const handlePresetClick = (pyeong: number) => {
    setPyeongInput(pyeong.toString());
  };

  return (
    <div className="space-y-8">
      {/* 메인 변환기 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            🔄 실시간 변환기
          </h2>
          <p className="text-gray-600">
            평수나 제곱미터 중 하나를 입력하면 자동으로 변환됩니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 평수 입력 */}
          <div className="relative">
            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">🏘️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">평수</h3>
              </div>
              <Input
                type="number"
                value={pyeongInput}
                onChange={handlePyeongChange}
                placeholder="평수를 입력하세요 (예: 32)"
                error={!pyeongResult.isValid ? pyeongResult.error : undefined}
                variant={!pyeongResult.isValid && pyeongInput ? 'error' : 'default'}
              />
              {pyeongResult.isValid && pyeongInput && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-200">
                  <div className="text-lg font-bold text-blue-600">
                    {pyeongResult.squareMeters.toFixed(2)}㎡
                  </div>
                  <div className="text-sm text-gray-600">제곱미터</div>
                </div>
              )}
            </div>
          </div>

          {/* 제곱미터 입력 */}
          <div className="relative">
            <div className="bg-green-50/50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">📐</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">제곱미터</h3>
              </div>
              <Input
                type="number"
                value={squareMetersInput}
                onChange={handleSquareMetersChange}
                placeholder="제곱미터를 입력하세요 (예: 105.8)"
                error={!squareMetersResult.isValid ? squareMetersResult.error : undefined}
                variant={!squareMetersResult.isValid && squareMetersInput ? 'error' : 'default'}
              />
              {squareMetersResult.isValid && squareMetersInput && (
                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-green-200">
                  <div className="text-lg font-bold text-green-600">
                    {squareMetersResult.pyeong.toFixed(2)}평
                  </div>
                  <div className="text-sm text-gray-600">평수</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={swapValues}
            disabled={!pyeongInput && !squareMetersInput}
            className="flex items-center gap-2"
          >
            <span>↔</span>
            값 교환
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={clearAll}
            disabled={!pyeongInput && !squareMetersInput}
            className="flex items-center gap-2"
          >
            <span>🗑</span>
            전체 지우기
          </Button>
        </div>
      </div>

      {/* 빠른 선택 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            🏢 일반적인 아파트 평수
          </h3>
          <p className="text-gray-600">
            자주 찾는 평수를 클릭하면 즉시 변환됩니다
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {APARTMENT_TYPES.map(({ pyeong, description }) => (
            <button
              key={pyeong}
              onClick={() => handlePresetClick(pyeong)}
              className="p-4 text-left bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
            >
              <div className="font-semibold text-blue-600">{pyeong}평</div>
              <div className="text-sm text-gray-600">{description}</div>
              <div className="text-xs text-gray-500 mt-1">
                {(pyeong * 3.3058).toFixed(1)}㎡
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 변환 공식 안내 */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            📐 변환 공식
          </h3>
          <p className="text-gray-600">
            정확한 법정 변환 계수를 사용합니다
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏘️</span>
              <span className="font-bold text-blue-600">평수 → 제곱미터</span>
            </div>
            <div className="text-lg font-mono bg-blue-50 p-3 rounded-lg">
              평수 × 3.3058 = 제곱미터
            </div>
            <div className="text-sm text-gray-600 mt-2">
              예: 32평 × 3.3058 = 105.8㎡
            </div>
          </div>
          
          <div className="bg-white/80 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📐</span>
              <span className="font-bold text-green-600">제곱미터 → 평수</span>
            </div>
            <div className="text-lg font-mono bg-green-50 p-3 rounded-lg">
              제곱미터 ÷ 3.3058 = 평수
            </div>
            <div className="text-sm text-gray-600 mt-2">
              예: 105.8㎡ ÷ 3.3058 = 32평
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-blue-200">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-sm font-medium text-gray-700">
              1평 = 3.3058㎡ (정확한 법정 변환 계수)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
