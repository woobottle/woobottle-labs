'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TimerState,
  TimerStats,
  TimerPhase,
  TimerStatus,
  DEFAULT_TIMER_SETTINGS,
  getPhaseTime,
  getNextPhase,
  getPhaseInfo,
  showNotification,
  updatePageTitle,
  requestNotificationPermission,

} from 'entities/timer';

const STORAGE_KEYS = {
  SETTINGS: 'pomodoro-settings',
  STATS: 'pomodoro-stats',
  STATE: 'pomodoro-state',
} as const;

export const usePomodoroTimer = () => {
  const [timerState, setTimerState] = useState<TimerState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) {
        const parsedState = JSON.parse(saved);
        return {
          ...parsedState,
          status: 'idle', // 페이지 새로고침 시 항상 idle로 시작
        };
      }
    }
    
    return {
      phase: 'focus' as TimerPhase,
      status: 'idle' as TimerStatus,
      timeLeft: getPhaseTime('focus', DEFAULT_TIMER_SETTINGS),
      totalTime: getPhaseTime('focus', DEFAULT_TIMER_SETTINGS),
      currentSession: 1,
      completedSessions: 0,
      settings: DEFAULT_TIMER_SETTINGS,
    };
  });

  const [stats, setStats] = useState<TimerStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    
    return {
      totalFocusTime: 0,
      totalSessions: 0,
      todayFocusTime: 0,
      todaySessions: 0,
      streak: 0,
    };
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);

  // 알림 권한 요청
  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await requestNotificationPermission();
      setNotificationPermission(hasPermission);
    };
    
    if (timerState.settings.enableNotifications) {
      checkPermission();
    }
  }, [timerState.settings.enableNotifications]);

  // 타이머 상태 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(timerState));
  }, [timerState]);

  // 통계 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  // 페이지 제목 업데이트
  useEffect(() => {
    const isRunning = timerState.status === 'running';
    updatePageTitle(timerState.timeLeft, timerState.phase, isRunning);
  }, [timerState.timeLeft, timerState.phase, timerState.status]);

  // 타이머 로직
  useEffect(() => {
    if (timerState.status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            // 타이머 완료
            handleTimerComplete(prev);
            return {
              ...prev,
              timeLeft: 0,
              status: 'completed',
            };
          }
          
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.status]);

  const handleTimerComplete = useCallback((state: TimerState) => {
    
    // 알림 표시
    if (state.settings.enableNotifications && notificationPermission) {
      if (state.phase === 'focus') {
        showNotification(
          '집중 시간 완료! 🎉',
          '잘했어요! 이제 휴식 시간입니다.',
          '/favicon.ico'
        );
      } else {
        showNotification(
          '휴식 시간 완료! ⏰',
          '휴식이 끝났습니다. 다시 집중해볼까요?',
          '/favicon.ico'
        );
      }
    }

    // 통계 업데이트 - 집중 세션 완료 시만
    if (state.phase === 'focus') {
      setStats(prevStats => {
        const focusTimeInMinutes = state.settings.focusTime; // 분 단위
        
        return {
          totalFocusTime: prevStats.totalFocusTime + focusTimeInMinutes,
          totalSessions: prevStats.totalSessions + 1,
          todayFocusTime: prevStats.todayFocusTime + focusTimeInMinutes,
          todaySessions: prevStats.todaySessions + 1,
          streak: prevStats.streak + 1,
        };
      });
    }

    // 다음 페이즈로 전환
    const nextPhase = getNextPhase(state.phase, state.completedSessions, state.settings);
    const nextTime = getPhaseTime(nextPhase, state.settings);
    
    setTimerState(prev => ({
      ...prev,
      phase: nextPhase,
      timeLeft: nextTime,
      totalTime: nextTime,
      completedSessions: prev.phase === 'focus' ? prev.completedSessions + 1 : prev.completedSessions,
      currentSession: nextPhase === 'focus' ? prev.currentSession + 1 : prev.currentSession,
      status: (nextPhase === 'focus' && state.settings.autoStartPomodoros) || 
              (nextPhase !== 'focus' && state.settings.autoStartBreaks) ? 'running' : 'idle',
    }));
  }, [notificationPermission, setStats]);

  const startTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, status: 'running' }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, status: 'paused' }));
  }, []);

  const resetTimer = useCallback(() => {
    const newTime = getPhaseTime(timerState.phase, timerState.settings);
    setTimerState(prev => ({
      ...prev,
      status: 'idle',
      timeLeft: newTime,
      totalTime: newTime,
    }));
  }, [timerState.phase, timerState.settings]);

  const skipPhase = useCallback(() => {
    const nextPhase = getNextPhase(timerState.phase, timerState.completedSessions, timerState.settings);
    const nextTime = getPhaseTime(nextPhase, timerState.settings);
    
    setTimerState(prev => ({
      ...prev,
      phase: nextPhase,
      timeLeft: nextTime,
      totalTime: nextTime,
      completedSessions: prev.phase === 'focus' ? prev.completedSessions + 1 : prev.completedSessions,
      currentSession: nextPhase === 'focus' ? prev.currentSession + 1 : prev.currentSession,
      status: 'idle',
    }));
  }, [timerState.phase, timerState.completedSessions, timerState.settings]);

  const updateSettings = useCallback((newSettings: Partial<typeof timerState.settings>) => {
    setTimerState(prev => {
      const updatedSettings = { ...prev.settings, ...newSettings };
      const newTime = getPhaseTime(prev.phase, updatedSettings);
      
      // localStorage에 업데이트된 설정 저장
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
      
      return {
        ...prev,
        settings: updatedSettings,
        timeLeft: prev.status === 'idle' ? newTime : prev.timeLeft,
        totalTime: newTime,
      };
    });
  }, [timerState]);

  const resetStats = useCallback(() => {
    const resetStats: TimerStats = {
      totalFocusTime: 0,
      totalSessions: 0,
      todayFocusTime: 0,
      todaySessions: 0,
      streak: 0,
    };
    setStats(resetStats);
  }, []);

  return {
    // State
    timerState,
    stats,
    notificationPermission,
    
    // Actions
    startTimer,
    pauseTimer,
    resetTimer,
    skipPhase,
    updateSettings,
    resetStats,
    
    // Computed
    isRunning: timerState.status === 'running',
    isPaused: timerState.status === 'paused',
    isIdle: timerState.status === 'idle',
    isCompleted: timerState.status === 'completed',
    currentPhaseInfo: getPhaseInfo(timerState.phase),
    progress: timerState.totalTime > 0 ? ((timerState.totalTime - timerState.timeLeft) / timerState.totalTime) * 100 : 0,
  };
};
