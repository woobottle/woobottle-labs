'use client';

import React from 'react';
import { Card } from 'shared/ui/card';
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 메인 변환기 */}
      <Card variant="elevated" padding="lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            아파트 평수 변환기
          </h2>
          <p className="text-gray-600">
            평수와 제곱미터를 상호 변환해보세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 평수 입력 */}
          <div>
            <Input
              label="평수 (평)"
              type="number"
              value={pyeongInput}
              onChange={handlePyeongChange}
              placeholder="평수를 입력하세요"
              error={!pyeongResult.isValid ? pyeongResult.error : undefined}
              variant={!pyeongResult.isValid && pyeongInput ? 'error' : 'default'}
            />
            {pyeongResult.isValid && pyeongInput && (
              <div className="mt-2 text-sm text-green-600">
                {pyeongResult.squareMeters.toFixed(2)}㎡
              </div>
            )}
          </div>

          {/* 제곱미터 입력 */}
          <div>
            <Input
              label="제곱미터 (㎡)"
              type="number"
              value={squareMetersInput}
              onChange={handleSquareMetersChange}
              placeholder="제곱미터를 입력하세요"
              error={!squareMetersResult.isValid ? squareMetersResult.error : undefined}
              variant={!squareMetersResult.isValid && squareMetersInput ? 'error' : 'default'}
            />
            {squareMetersResult.isValid && squareMetersInput && (
              <div className="mt-2 text-sm text-green-600">
                {squareMetersResult.pyeong.toFixed(2)}평
              </div>
            )}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex justify-center gap-4">
          <Button
            variant="secondary"
            onClick={swapValues}
            disabled={!pyeongInput && !squareMetersInput}
          >
            ↔ 값 교환
          </Button>
          <Button
            variant="default"
            onClick={clearAll}
            disabled={!pyeongInput && !squareMetersInput}
          >
            🗑 전체 지우기
          </Button>
        </div>
      </Card>

      {/* 빠른 선택 */}
      <Card variant="bordered" padding="lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          일반적인 아파트 평수
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {APARTMENT_TYPES.map(({ pyeong, description }) => (
            <button
              key={pyeong}
              onClick={() => handlePresetClick(pyeong)}
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="font-semibold text-blue-600">{pyeong}평</div>
              <div className="text-sm text-gray-600">{description}</div>
              <div className="text-xs text-gray-500 mt-1">
                {(pyeong * 3.3058).toFixed(1)}㎡
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* 변환 공식 안내 */}
      <Card variant="default" padding="lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          변환 공식
        </h3>
        <div className="space-y-3 text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">평수 → 제곱미터:</span>
            <span>평수 × 3.3058 = 제곱미터</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-medium">제곱미터 → 평수:</span>
            <span>제곱미터 ÷ 3.3058 = 평수</span>
          </div>
          <div className="text-sm text-gray-500 mt-4">
            * 1평 = 3.3058㎡ (정확한 법정 변환 계수)
          </div>
        </div>
      </Card>
    </div>
  );
};
