'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react';
import AppLayout from '../../components/AppLayout';

export default function TimerPage() {
  const [time, setTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('stopwatch');
  const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (mode === 'timer') {
            if (prevTime <= 1) {
              setIsRunning(false);
              // Timer finished - could add notification here
              return 0;
            }
            return prevTime - 1;
          } else {
            return prevTime + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (mode === 'timer' && time === 0) {
      const totalSeconds = timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
      setTime(totalSeconds);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'timer') {
      setTime(0);
    } else {
      setTime(0);
    }
  };

  const Button = ({ onClick, className, children, disabled = false }: {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-xl font-semibold transition-all duration-200 
        active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            타이머
          </h1>
          <p className="text-gray-600 text-lg">
            작업 시간을 측정하고 관리하세요
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => {
                  setMode('stopwatch');
                  handleStop();
                }}
                className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                  mode === 'stopwatch'
                    ? 'bg-white shadow-md text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                스톱워치
              </button>
              <button
                onClick={() => {
                  setMode('timer');
                  handleStop();
                }}
                className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                  mode === 'timer'
                    ? 'bg-white shadow-md text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                타이머
              </button>
            </div>
          </div>

          {/* Timer Input (only for timer mode) */}
          {mode === 'timer' && !isRunning && time === 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">시간 설정</h3>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <label className="block text-sm text-gray-600 mb-2">시간</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={timerInput.hours}
                    onChange={(e) => setTimerInput(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-center">
                  <label className="block text-sm text-gray-600 mb-2">분</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerInput.minutes}
                    onChange={(e) => setTimerInput(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-center">
                  <label className="block text-sm text-gray-600 mb-2">초</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerInput.seconds}
                    onChange={(e) => setTimerInput(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Time Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-80 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200">
              <Clock className="w-8 h-8 text-gray-400 mr-4" />
              <span className="text-6xl font-mono font-bold text-gray-800">
                {formatTime(time)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={mode === 'timer' && time === 0 && timerInput.hours === 0 && timerInput.minutes === 0 && timerInput.seconds === 0}
              >
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  시작
                </div>
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <div className="flex items-center gap-2">
                  <Pause className="w-5 h-5" />
                  일시정지
                </div>
              </Button>
            )}

            <Button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5" />
                정지
              </div>
            </Button>

            <Button
              onClick={handleReset}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                리셋
              </div>
            </Button>
          </div>

          {/* Status */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              상태: <span className={`font-semibold ${isRunning ? 'text-green-600' : 'text-gray-800'}`}>
                {isRunning ? '실행 중' : '정지됨'}
              </span>
            </p>
            {mode === 'timer' && time === 0 && !isRunning && (
              <p className="text-sm text-orange-600 mt-2">
                시간을 설정한 후 시작 버튼을 클릭하세요
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
