'use client';

import React from 'react';
import { formatTime, TimerPhase } from 'entities/timer';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  phase: TimerPhase;
  currentSession: number;
  completedSessions: number;
  isRunning: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalTime,
  phase,
  currentSession,
  completedSessions,
  isRunning,
}) => {
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  
  const getPhaseColor = () => {
    switch (phase) {
      case 'focus':
        return 'text-red-600 dark:text-red-400';
      case 'shortBreak':
        return 'text-green-600 dark:text-green-400';
      case 'longBreak':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getProgressColor = () => {
    switch (phase) {
      case 'focus':
        return 'stroke-red-500';
      case 'shortBreak':
        return 'stroke-green-500';
      case 'longBreak':
        return 'stroke-blue-500';
      default:
        return 'stroke-gray-500';
    }
  };

  const getPhaseEmoji = () => {
    switch (phase) {
      case 'focus':
        return '🍅';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🌴';
      default:
        return '⏰';
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'focus':
        return '집중 시간';
      case 'shortBreak':
        return '짧은 휴식';
      case 'longBreak':
        return '긴 휴식';
      default:
        return '타이머';
    }
  };

  const circumference = 2 * Math.PI * 120; // 반지름 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* 원형 진행률 표시기 */}
      <div className="relative">
        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 256 256">
          {/* 배경 원 */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* 진행률 원 */}
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-in-out ${getProgressColor()}`}
          />
        </svg>
        
        {/* 중앙 시간 표시 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl mb-2">{getPhaseEmoji()}</div>
          <div className={`text-5xl font-mono font-bold ${getPhaseColor()}`}>
            {formatTime(timeLeft)}
          </div>
          <div className={`text-lg font-medium mt-2 ${getPhaseColor()}`}>
            {getPhaseLabel()}
          </div>
          {isRunning && (
            <div className="w-3 h-3 bg-current rounded-full mt-2 animate-pulse" />
          )}
        </div>
      </div>

      {/* 세션 정보 */}
      <div className="flex items-center space-x-8 text-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 dark:border-gray-700/20">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {currentSession}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            현재 세션
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 dark:border-gray-700/20">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {completedSessions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            완료된 세션
          </div>
        </div>
      </div>
    </div>
  );
};
