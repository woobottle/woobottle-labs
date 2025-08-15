'use client';

import React from 'react';
import { Card } from 'shared/ui/card';
import { Button } from 'shared/ui/button';
import { TimerStats } from 'entities/timer';
import { BarChart3, Clock, Target, Flame, RotateCcw } from 'lucide-react';

interface TimerStatsProps {
  stats: TimerStats;
  onResetStats: () => void;
}

export const TimerStatsDisplay: React.FC<TimerStatsProps> = ({
  stats,
  onResetStats,
}) => {
  const formatHours = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}분`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
  };

  const handleResetStats = () => {
    if (window.confirm('정말로 모든 통계를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      onResetStats();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          통계
        </h2>
        <Button
          variant="danger"
          size="sm"
          onClick={handleResetStats}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          초기화
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 총 집중 시간 */}
        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {formatHours(stats.totalFocusTime)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 집중 시간
          </div>
        </Card>

        {/* 총 세션 수 */}
        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {stats.totalSessions}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 완료 세션
          </div>
        </Card>

        {/* 오늘 집중 시간 */}
        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {formatHours(stats.todayFocusTime)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            오늘 집중 시간
          </div>
        </Card>

        {/* 연속 일수 */}
        <Card className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {stats.streak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            연속 일수
          </div>
        </Card>
      </div>

      {/* 오늘의 성과 */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          오늘의 성과
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.todaySessions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              완료한 세션
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {formatHours(stats.todayFocusTime)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              집중한 시간
            </div>
          </div>
        </div>
        
        {stats.todaySessions > 0 && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-center text-green-700 dark:text-green-300">
              🎉 오늘도 수고하셨습니다! 
              {stats.todaySessions >= 4 && ' 정말 대단해요!'}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
