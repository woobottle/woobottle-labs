"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
import { AreaConverter } from "features/area-conversion";

export const AreaConverterPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-10">
        <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
          CONVERT
        </div>
        <h1 className="text-3xl font-semibold text-white">
          아파트 평수 변환기
        </h1>
        <p className="mt-2 text-[#A3A3A3]">
          평수 ↔ 제곱미터 변환 (법정 변환 계수 기반)
        </p>
      </div>

      <AreaConverter />

      {/* 정보 및 기능 하이라이트 섹션 */}
      <div className="mt-16 space-y-12">
        {/* 평수와 제곱미터 설명 */}
        <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            평수와 제곱미터 가이드
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-semibold text-white">평(坪)</h3>
              </div>
              <p className="text-[#A3A3A3] leading-relaxed">
                한국에서 전통적으로 사용하는 면적 단위입니다. 부동산 거래,
                아파트 분양, 임대 계약에서 널리 사용되며, 1평은 정확히
                3.3058㎡에 해당합니다.
              </p>
              <div className="mt-3 text-sm text-[#A3A3A3] bg-[#0A0A0A] border border-[#1A1A1A] px-3 py-1 rounded-full inline-block">
                예: 32평 = 105.8㎡
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-semibold text-white">
                  제곱미터(㎡)
                </h3>
              </div>
              <p className="text-[#A3A3A3] leading-relaxed">
                국제 표준 면적 단위로 공식 문서, 건축 도면, 등기부등본에서
                사용됩니다. 정확한 계산과 국제적 호환성을 위해 점차 널리
                사용되고 있습니다.
              </p>
              <div className="mt-3 text-sm text-[#A3A3A3] bg-[#0A0A0A] border border-[#1A1A1A] px-3 py-1 rounded-full inline-block">
                예: 105.8㎡ = 32평
              </div>
            </div>
          </div>
        </div>

        {/* 기능 하이라이트 */}
        <div className="bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            변환기 특징
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2">실시간 변환</h3>
              <p className="text-sm text-[#A3A3A3]">입력과 동시에 즉시 변환</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2">정확한 계수</h3>
              <p className="text-sm text-[#A3A3A3]">법정 변환 계수 사용</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2">빠른 선택</h3>
              <p className="text-sm text-[#A3A3A3]">일반적인 평수 프리셋</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white mb-2">반응형</h3>
              <p className="text-sm text-[#A3A3A3]">모든 기기 지원</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
