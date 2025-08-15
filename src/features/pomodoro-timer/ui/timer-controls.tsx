'use client';

import React from 'react';
import { Button } from 'shared/ui/button';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  isIdle,
  onStart,
  onPause,
  onReset,
  onSkip,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {/* 시작/일시정지 버튼 */}
      {isRunning ? (
        <Button
          variant="warning"
          size="lg"
          onClick={onPause}
          className="flex items-center gap-2 px-8 py-4 text-lg"
        >
          <Pause className="w-5 h-5" />
          일시정지
        </Button>
      ) : (
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          className="flex items-center gap-2 px-8 py-4 text-lg"
        >
          <Play className="w-5 h-5" />
          {isPaused ? '계속하기' : '시작'}
        </Button>
      )}

      {/* 리셋 버튼 */}
      <Button
        variant="secondary"
        size="lg"
        onClick={onReset}
        disabled={isIdle}
        className="flex items-center gap-2 px-6 py-4 text-lg"
      >
        <RotateCcw className="w-5 h-5" />
        리셋
      </Button>

      {/* 건너뛰기 버튼 */}
      <Button
        variant="default"
        size="lg"
        onClick={onSkip}
        className="flex items-center gap-2 px-6 py-4 text-lg"
      >
        <SkipForward className="w-5 h-5" />
        건너뛰기
      </Button>
    </div>
  );
};
