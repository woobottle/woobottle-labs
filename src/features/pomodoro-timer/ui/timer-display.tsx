"use client";

import React from "react";
import { formatTime, TimerPhase } from "entities/timer";

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
  const progress =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const getPhaseColor = () => {
    return "text-white";
  };

  const getPhaseEmoji = () => {
    switch (phase) {
      case "focus":
        return "🍅";
      case "shortBreak":
        return "☕";
      case "longBreak":
        return "🌴";
      default:
        return "⏰";
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "focus":
        return "집중 시간";
      case "shortBreak":
        return "짧은 휴식";
      case "longBreak":
        return "긴 휴식";
      default:
        return "타이머";
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
            className="text-[#1A1A1A]"
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
            className="text-white transition-[stroke-dashoffset] duration-1000 ease-in-out"
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
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <div className="text-2xl font-bold text-white">{currentSession}</div>
          <div className="text-sm text-[#A3A3A3]">현재 세션</div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            {completedSessions}
          </div>
          <div className="text-sm text-[#A3A3A3]">완료된 세션</div>
        </div>
      </div>
    </div>
  );
};
