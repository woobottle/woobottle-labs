import { TimerPhase, TimerSettings, TIMER_PHASES, DEFAULT_TIMER_SETTINGS } from '../model/types';

/**
 * 시간을 MM:SS 형식으로 포맷팅
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * 분을 초로 변환
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * 초를 분으로 변환
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60);
};

/**
 * 현재 페이즈의 총 시간을 가져오기
 */
export const getPhaseTime = (phase: TimerPhase, settings?: TimerSettings): number => {
  const timerSettings = settings || DEFAULT_TIMER_SETTINGS;
  switch (phase) {
    case 'focus':
      return minutesToSeconds(timerSettings.focusTime);
    case 'shortBreak':
      return minutesToSeconds(timerSettings.shortBreakTime);
    case 'longBreak':
      return minutesToSeconds(timerSettings.longBreakTime);
    default:
      return minutesToSeconds(timerSettings.focusTime);
  }
};

/**
 * 다음 페이즈 결정
 */
export const getNextPhase = (
  currentPhase: TimerPhase,
  completedSessions: number,
  settings: TimerSettings
): TimerPhase => {
  if (currentPhase === 'focus') {
    // 집중 시간 완료 후
    const sessionAfterComplete = completedSessions + 1;
    const isLongBreakTime = sessionAfterComplete % settings.sessionsUntilLongBreak === 0;
    return isLongBreakTime ? 'longBreak' : 'shortBreak';
  } else {
    // 휴식 시간 완료 후
    return 'focus';
  }
};

/**
 * 페이즈 정보 가져오기
 */
export const getPhaseInfo = (phase: TimerPhase) => {
  return TIMER_PHASES[phase];
};

/**
 * 진행률 계산 (0-100)
 */
export const calculateProgress = (timeLeft: number, totalTime: number): number => {
  if (totalTime === 0) return 0;
  return Math.round(((totalTime - timeLeft) / totalTime) * 100);
};

/**
 * 브라우저 알림 권한 요청
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) {
      console.warn('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('알림 권한 요청 중 오류:', error);
    return false;
  }
};

/**
 * 브라우저 알림 표시
 */
export const showNotification = (title: string, body: string, icon?: string): void => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'pomodoro-timer',
      requireInteraction: true,
    });

    // 5초 후 자동으로 닫기
    setTimeout(() => {
      notification.close();
    }, 5000);
  }
};

/**
 * 페이지 제목 업데이트
 */
export const updatePageTitle = (timeLeft: number, phase: TimerPhase, isRunning: boolean = true): void => {
  if (!isRunning) {
    document.title = '뽀모도로 타이머 - WooBottle Labs';
    return;
  }
  
  const phaseInfo = getPhaseInfo(phase);
  const timeString = formatTime(timeLeft);
  document.title = `${timeString} - ${phaseInfo.emoji} ${phaseInfo.label} | WooBottle Labs`;
};

/**
 * 오늘 날짜 문자열 생성 (YYYY-MM-DD)
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};
