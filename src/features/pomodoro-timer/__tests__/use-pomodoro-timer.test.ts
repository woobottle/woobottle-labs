import { renderHook, act } from '@testing-library/react';
import { usePomodoroTimer } from '../model/use-pomodoro-timer';
import { DEFAULT_TIMER_SETTINGS } from 'entities/timer';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  value: {
    requestPermission: jest.fn(() => Promise.resolve('granted')),
    permission: 'granted',
  },
  writable: true,
});

describe('usePomodoroTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockLocalStorage.getItem.mockReturnValue(null);
    document.title = 'Test';
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('초기 상태', () => {
    it('should initialize with default state', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      expect(result.current.timerState.phase).toBe('focus');
      expect(result.current.timerState.status).toBe('idle');
      expect(result.current.timerState.timeLeft).toBe(1500); // 25 minutes
      expect(result.current.timerState.currentSession).toBe(1);
      expect(result.current.timerState.completedSessions).toBe(0);
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });

    it('should load state from localStorage if available', () => {
      jest.useFakeTimers();
      const savedState = {
        phase: 'shortBreak',
        status: 'paused',
        timeLeft: 300,
        totalTime: 300,
        currentSession: 2,
        completedSessions: 1,
        settings: DEFAULT_TIMER_SETTINGS,
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedState));

      const { result } = renderHook(() => usePomodoroTimer());

      expect(result.current.timerState.phase).toBe('shortBreak');
      expect(result.current.timerState.status).toBe('idle'); // Always starts as idle
      expect(result.current.timerState.timeLeft).toBe(300);
      expect(result.current.timerState.currentSession).toBe(2);
      expect(result.current.timerState.completedSessions).toBe(1);
    });
  });

  describe('타이머 제어', () => {
    it('should start timer', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      expect(result.current.timerState.status).toBe('running');
      expect(result.current.isRunning).toBe(true);
      expect(result.current.isIdle).toBe(false);
    });

    it('should pause timer', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        result.current.pauseTimer();
      });

      expect(result.current.timerState.status).toBe('paused');
      expect(result.current.isPaused).toBe(true);
      expect(result.current.isRunning).toBe(false);
    });

    it('should reset timer', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      // Start and run timer for a bit
      act(() => {
        result.current.startTimer();
      });

      act(() => {
        jest.advanceTimersByTime(10000); // 10 seconds
      });

      act(() => {
        result.current.resetTimer();
      });

      expect(result.current.timerState.status).toBe('idle');
      expect(result.current.timerState.timeLeft).toBe(1500); // Back to 25 minutes
      expect(result.current.isIdle).toBe(true);
    });

    it('should skip phase', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.skipPhase();
      });

      expect(result.current.timerState.phase).toBe('shortBreak');
      expect(result.current.timerState.timeLeft).toBe(300); // 5 minutes
      expect(result.current.timerState.completedSessions).toBe(1);
      expect(result.current.timerState.status).toBe('idle');
    });
  });

  describe('타이머 실행', () => {
    it('should countdown when running', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      const initialTime = result.current.timerState.timeLeft;

      act(() => {
        jest.advanceTimersByTime(1000); // 1 second
      });

      expect(result.current.timerState.timeLeft).toBe(initialTime - 1);
    });

    it('should not countdown when paused', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        result.current.pauseTimer();
      });

      const timeWhenPaused = result.current.timerState.timeLeft;

      act(() => {
        jest.advanceTimersByTime(5000); // 5 seconds
      });

      expect(result.current.timerState.timeLeft).toBe(timeWhenPaused);
    });

    it('should complete phase when timer reaches zero', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      // Set timer to almost complete
      act(() => {
        result.current.updateSettings({ focusTime: 1 }); // 1 minute
      });

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        jest.advanceTimersByTime(60000); // 1 minute
      });

      expect(result.current.timerState.phase).toBe('shortBreak');
      expect(result.current.timerState.completedSessions).toBe(1);
      expect(result.current.timerState.status).toBe('idle');
    });
  });

  describe('설정 업데이트', () => {
    it('should update settings', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      const newSettings = {
        focusTime: 30,
        shortBreakTime: 10,
      };

      act(() => {
        result.current.updateSettings(newSettings);
      });

      expect(result.current.timerState.settings.focusTime).toBe(30);
      expect(result.current.timerState.settings.shortBreakTime).toBe(10);
      expect(result.current.timerState.timeLeft).toBe(1800); // 30 minutes
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should not update time when timer is running', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      const timeBeforeUpdate = result.current.timerState.timeLeft;

      act(() => {
        result.current.updateSettings({ focusTime: 30 });
      });

      expect(result.current.timerState.timeLeft).toBe(timeBeforeUpdate);
    });
  });

  describe('통계 관리', () => {
    it('should initialize stats from localStorage', () => {
      jest.useFakeTimers();
      const savedStats = {
        totalFocusTime: 100,
        totalSessions: 4,
        todayFocusTime: 25,
        todaySessions: 1,
        streak: 5,
      };
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'pomodoro-stats') {
          return JSON.stringify(savedStats);
        }
        return null;
      });

      const { result } = renderHook(() => usePomodoroTimer());

      expect(result.current.stats.totalFocusTime).toBe(100);
      expect(result.current.stats.totalSessions).toBe(4);
      expect(result.current.stats.todayFocusTime).toBe(25);
      expect(result.current.stats.todaySessions).toBe(1);
      expect(result.current.stats.streak).toBe(5);
    });

    it('should reset stats', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.resetStats();
      });

      expect(result.current.stats.totalFocusTime).toBe(0);
      expect(result.current.stats.totalSessions).toBe(0);
      expect(result.current.stats.todayFocusTime).toBe(0);
      expect(result.current.stats.todaySessions).toBe(0);
      expect(result.current.stats.streak).toBe(0);
    });
  });

  describe('자동 시작', () => {
    it('should auto start breaks when enabled', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.updateSettings({ 
          autoStartBreaks: true,
          focusTime: 1 // 1 minute for quick test
        });
      });

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        jest.advanceTimersByTime(60000); // Complete focus session
      });

      expect(result.current.timerState.phase).toBe('shortBreak');
      expect(result.current.timerState.status).toBe('running'); // Auto started
    });

    it('should auto start pomodoros when enabled', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      // First complete a focus session to get to break
      act(() => {
        result.current.updateSettings({ 
          focusTime: 1,
          shortBreakTime: 1,
          autoStartPomodoros: true
        });
      });

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        jest.advanceTimersByTime(60000); // Complete focus
      });

      act(() => {
        result.current.startTimer(); // Start break manually
      });

      act(() => {
        jest.advanceTimersByTime(60000); // Complete break
      });

      expect(result.current.timerState.phase).toBe('focus');
      expect(result.current.timerState.status).toBe('running'); // Auto started
    });
  });

  describe('로컬 스토리지 저장', () => {
    it('should save state to localStorage when timer updates', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'pomodoro-state',
        expect.stringContaining('"status":"running"')
      );
    });

    it('should save stats to localStorage when updated', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => usePomodoroTimer());

      act(() => {
        result.current.updateSettings({ focusTime: 1 });
      });

      act(() => {
        result.current.startTimer();
      });

      act(() => {
        jest.advanceTimersByTime(60000); // Complete session
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'pomodoro-stats',
        expect.stringContaining('"totalSessions":1')
      );
    });
  });
});
