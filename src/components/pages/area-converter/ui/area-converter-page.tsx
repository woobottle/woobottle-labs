'use client';

import React from 'react';
import { AreaConverter } from 'features/area-conversion';

export const AreaConverterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏠 아파트 평수 변환기
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            아파트나 부동산의 평수를 제곱미터로, 제곱미터를 평수로 간편하게 변환하세요.
            정확한 법정 변환 계수를 사용하여 신뢰할 수 있는 결과를 제공합니다.
          </p>
        </div>
        
        <AreaConverter />
        
        {/* 추가 정보 섹션 */}
        <div className="mt-12 text-center">
          <div className="bg-white/50 backdrop-blur rounded-2xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              💡 평수와 제곱미터란?
            </h3>
            <div className="text-sm text-gray-700 space-y-2 text-left">
              <p>
                <strong>평(坪)</strong>: 한국에서 주로 사용하는 면적 단위로, 
                약 3.3㎡에 해당합니다. 부동산 거래에서 널리 사용됩니다.
              </p>
              <p>
                <strong>제곱미터(㎡)</strong>: 국제 표준 면적 단위로, 
                공식 문서나 건축 도면에서 사용됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
