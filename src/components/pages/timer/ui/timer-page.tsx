'use client';

import React from 'react';
import { AppLayout } from 'widgets/app-layout';
import { PomodoroTimer } from 'features/pomodoro-timer';

export const TimerPage: React.FC = () => {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4">
            <span className="text-2xl">🍅</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          뽀모도로 타이머
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          집중력을 높이고 생산성을 향상시키는 시간 관리 기법입니다.
          25분 집중, 5분 휴식의 리듬으로 효율적인 작업을 경험해보세요.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-sm font-medium">집중력 향상</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm font-medium">브라우저 알림</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span className="text-sm font-medium">통계 추적</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span className="text-sm font-medium">설정 저장</span>
          </div>
        </div>
      </div>
      
      <PomodoroTimer />
      
      {/* 사용법 가이드 */}
      <div className="mt-16 space-y-12">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            📋 사용법 가이드
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">작업 선택</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">집중할 작업을 미리 정하고 시작하세요</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">타이머 시작</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">25분 동안 오직 그 작업에만 집중하세요</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">짧은 휴식</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">5분간 완전히 쉬고 다음 세션을 준비하세요</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">4️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">긴 휴식</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">4세션 후 15-30분 충분한 휴식을 취하세요</p>
            </div>
          </div>
        </div>

        {/* 팁 섹션 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-800 p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            💡 효과적인 사용 팁
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="text-green-500">✅</span>
                해야 할 것
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  집중 시간에는 한 가지 작업에만 집중
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  휴식 시간에는 완전히 쉬기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  방해 요소 미리 제거하기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  매일 일정한 시간에 사용하기
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="text-red-500">❌</span>
                피해야 할 것
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  집중 시간에 다른 일 하기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  휴식 시간을 건너뛰기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  SNS나 메신저 확인하기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
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
