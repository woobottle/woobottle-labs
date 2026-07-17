"use client";

import React from "react";
import { AppLayout } from "widgets/app-layout";
import { ToolHeader } from "widgets/tool-header";
import { PomodoroTimer } from "features/pomodoro-timer";

export const TimerPage: React.FC = () => {
  return (
    <AppLayout>
      <ToolHeader
        eyebrow="TIMER"
        title="뽀모도로 타이머"
        description="집중력을 높이는 시간 관리 기법"
      />

      <PomodoroTimer />

      {/* 사용법 가이드 */}
      <div className="mt-16 space-y-12">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            📋 사용법 가이드
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-white mb-2">작업 선택</h3>
              <p className="text-sm text-[#A3A3A3]">
                집중할 작업을 미리 정하고 시작하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-white mb-2">타이머 시작</h3>
              <p className="text-sm text-[#A3A3A3]">
                25분 동안 오직 그 작업에만 집중하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-white mb-2">짧은 휴식</h3>
              <p className="text-sm text-[#A3A3A3]">
                5분간 완전히 쉬고 다음 세션을 준비하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">4️⃣</span>
              </div>
              <h3 className="font-semibold text-white mb-2">긴 휴식</h3>
              <p className="text-sm text-[#A3A3A3]">
                4세션 후 15-30분 충분한 휴식을 취하세요
              </p>
            </div>
          </div>
        </div>

        {/* 팁 섹션 */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            💡 효과적인 사용 팁
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-white">✅</span>
                해야 할 것
              </h3>
              <ul className="space-y-2 text-[#A3A3A3]">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  집중 시간에는 한 가지 작업에만 집중
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  휴식 시간에는 완전히 쉬기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  방해 요소 미리 제거하기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  매일 일정한 시간에 사용하기
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-white">❌</span>
                피해야 할 것
              </h3>
              <ul className="space-y-2 text-[#A3A3A3]">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  집중 시간에 다른 일 하기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  휴식 시간을 건너뛰기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  SNS나 메신저 확인하기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">•</span>
                  완벽주의에 빠지기
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
