'use client';

import React from 'react';
import { AppLayout } from 'widgets/app-layout';
import { AreaConverter } from 'features/area-conversion';

export const AreaConverterPage: React.FC = () => {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <span className="text-2xl">🏠</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          아파트 평수 변환기
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          아파트나 부동산의 평수를 제곱미터로, 제곱미터를 평수로 간편하게 변환하세요.
          정확한 법정 변환 계수를 사용하여 신뢰할 수 있는 결과를 제공합니다.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-sm font-medium">실시간 변환</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
            <span className="text-sm font-medium">정확한 계수</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
            <span className="text-sm font-medium">부동산 전문</span>
          </div>
        </div>
      </div>
      
      <AreaConverter />
      
      {/* 정보 및 기능 하이라이트 섹션 */}
      <div className="mt-16 space-y-12">
        {/* 평수와 제곱미터 설명 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 dark:bg-gray-800/80 dark:border-gray-700/30">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            💡 평수와 제곱미터 가이드
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-lg">🏘️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">평(坪)</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                한국에서 전통적으로 사용하는 면적 단위입니다. 
                부동산 거래, 아파트 분양, 임대 계약에서 널리 사용되며, 
                1평은 정확히 3.3058㎡에 해당합니다.
              </p>
              <div className="mt-3 text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
                예: 32평 = 105.8㎡
              </div>
            </div>
            
            <div className="bg-green-50/50 dark:bg-green-900/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-lg">📐</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">제곱미터(㎡)</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                국제 표준 면적 단위로 공식 문서, 건축 도면, 
                등기부등본에서 사용됩니다. 
                정확한 계산과 국제적 호환성을 위해 점차 널리 사용되고 있습니다.
              </p>
              <div className="mt-3 text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
                예: 105.8㎡ = 32평
              </div>
            </div>
          </div>
        </div>

        {/* 기능 하이라이트 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 dark:bg-gray-800/80 dark:border-gray-700/30">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            🎯 변환기 특징
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">실시간 변환</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">입력과 동시에 즉시 변환</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">정확한 계수</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">법정 변환 계수 사용</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">빠른 선택</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">일반적인 평수 프리셋</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">반응형</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">모든 기기 지원</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
