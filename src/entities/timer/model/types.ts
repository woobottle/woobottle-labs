export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerSettings {
  focusTime: number; // 분 단위
  shortBreakTime: number; // 분 단위
  longBreakTime: number; // 분 단위
  sessionsUntilLongBreak: number; // 긴 휴식까지의 세션 수
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  enableNotifications: boolean;
  enableSounds: boolean;
}

export interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  timeLeft: number; // 초 단위
  totalTime: number; // 초 단위
  currentSession: number; // 현재 세션 번호
  completedSessions: number; // 완료된 세션 수
  settings: TimerSettings;
}

export interface TimerStats {
  totalFocusTime: number; // 총 집중 시간 (분)
  totalSessions: number; // 총 완료된 세션 수
  todayFocusTime: number; // 오늘 집중 시간 (분)
  todaySessions: number; // 오늘 완료된 세션 수
  streak: number; // 연속 완료 일수
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  enableNotifications: true,
  enableSounds: true,
};

export const TIMER_PHASES = {
  focus: {
    label: '집중 시간',
    emoji: '🍅',
    color: 'red',
    description: '집중해서 작업하는 시간입니다',
  },
  shortBreak: {
    label: '짧은 휴식',
    emoji: '☕',
    color: 'green',
    description: '잠깐 휴식을 취하세요',
  },
  longBreak: {
    label: '긴 휴식',
    emoji: '🌴',
    color: 'blue',
    description: '충분한 휴식을 취하세요',
  },
} as const;
