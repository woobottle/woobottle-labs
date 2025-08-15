'use client';

import React from 'react';
import { usePomodoroTimer } from '../model/use-pomodoro-timer';
import { TimerDisplay } from './timer-display';
import { TimerControls } from './timer-controls';
import { TimerSettings } from './timer-settings';
import { TimerStatsDisplay } from './timer-stats';

export const PomodoroTimer: React.FC = () => {
  const {
    timerState,
    stats,
    notificationPermission,
    startTimer,
    pauseTimer,
    resetTimer,
    skipPhase,
    updateSettings,
    resetStats,
    isRunning,
    isPaused,
    isIdle,
    currentPhaseInfo,
  } = usePomodoroTimer();

  return (
    <div className="space-y-12">
      {/* 메인 타이머 섹션 */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {currentPhaseInfo.emoji} {currentPhaseInfo.label}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {currentPhaseInfo.description}
          </p>
        </div>

        <TimerDisplay
          timeLeft={timerState.timeLeft}
          totalTime={timerState.totalTime}
          phase={timerState.phase}
          currentSession={timerState.currentSession}
          completedSessions={timerState.completedSessions}
          isRunning={isRunning}
        />

        <TimerControls
          isRunning={isRunning}
          isPaused={isPaused}
          isIdle={isIdle}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          onSkip={skipPhase}
        />

        <div className="flex justify-center">
          <TimerSettings
            settings={timerState.settings}
            onUpdateSettings={updateSettings}
            notificationPermission={notificationPermission}
          />
        </div>
      </div>

      {/* 통계 섹션 */}
      <TimerStatsDisplay
        stats={stats}
        onResetStats={resetStats}
      />

      {/* 뽀모도로 기법 설명 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          🍅 뽀모도로 기법이란?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              기본 원리
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                25분 집중 작업 후 5분 휴식
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                4번의 집중 세션 후 15-30분 긴 휴식
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                집중 시간 동안 다른 일은 하지 않기
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                휴식 시간에는 완전히 쉬기
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
              효과
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                집중력 향상
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                정신적 피로 감소
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                생산성 증대
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                시간 관리 능력 향상
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
