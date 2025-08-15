import {
  formatTime,
  getPhaseTime,
  getNextPhase,
  getPhaseInfo,
  showNotification,
  updatePageTitle,
  requestNotificationPermission,
  getTodayString,
  DEFAULT_TIMER_SETTINGS,
} from '../lib/timer-utils';
import { TimerPhase, TimerSettings } from '../model/types';

describe('Timer Utils', () => {
  describe('formatTime', () => {
    it('should format seconds correctly', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(30)).toBe('00:30');
      expect(formatTime(59)).toBe('00:59');
    });

    it('should format minutes correctly', () => {
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(90)).toBe('01:30');
      expect(formatTime(1500)).toBe('25:00'); // 25 minutes
    });

    it('should handle large numbers', () => {
      expect(formatTime(3661)).toBe('61:01'); // 1 hour 1 minute 1 second
    });
  });

  describe('getPhaseTime', () => {
    const settings: TimerSettings = {
      focusTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      sessionsUntilLongBreak: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      enableNotifications: true,
      enableSounds: true,
    };

    it('should return correct time for focus phase', () => {
      expect(getPhaseTime('focus', settings)).toBe(1500); // 25 * 60
    });

    it('should return correct time for short break', () => {
      expect(getPhaseTime('shortBreak', settings)).toBe(300); // 5 * 60
    });

    it('should return correct time for long break', () => {
      expect(getPhaseTime('longBreak', settings)).toBe(900); // 15 * 60
    });

    it('should use default settings when not provided', () => {
      expect(getPhaseTime('focus', DEFAULT_TIMER_SETTINGS)).toBe(1500);
    });
  });

  describe('getNextPhase', () => {
    const settings: TimerSettings = {
      focusTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      sessionsUntilLongBreak: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      enableNotifications: true,
      enableSounds: true,
    };

    it('should go from focus to short break when not time for long break', () => {
      expect(getNextPhase('focus', 1, settings)).toBe('shortBreak');
      expect(getNextPhase('focus', 2, settings)).toBe('shortBreak');
      expect(getNextPhase('focus', 3, settings)).toBe('shortBreak');
    });

    it('should go from focus to long break after specified sessions', () => {
      expect(getNextPhase('focus', 4, settings)).toBe('longBreak');
      expect(getNextPhase('focus', 8, settings)).toBe('longBreak');
    });

    it('should go from break to focus', () => {
      expect(getNextPhase('shortBreak', 1, settings)).toBe('focus');
      expect(getNextPhase('longBreak', 4, settings)).toBe('focus');
    });

    it('should handle custom sessions until long break', () => {
      const customSettings = { ...settings, sessionsUntilLongBreak: 2 };
      expect(getNextPhase('focus', 2, customSettings)).toBe('longBreak');
      expect(getNextPhase('focus', 4, customSettings)).toBe('longBreak');
    });
  });

  describe('getPhaseInfo', () => {
    it('should return correct info for focus phase', () => {
      const info = getPhaseInfo('focus');
      expect(info.label).toBe('집중 시간');
      expect(info.emoji).toBe('🍅');
      expect(info.description).toContain('집중');
    });

    it('should return correct info for short break', () => {
      const info = getPhaseInfo('shortBreak');
      expect(info.label).toBe('짧은 휴식');
      expect(info.emoji).toBe('☕');
      expect(info.description).toContain('휴식');
    });

    it('should return correct info for long break', () => {
      const info = getPhaseInfo('longBreak');
      expect(info.label).toBe('긴 휴식');
      expect(info.emoji).toBe('🌴');
      expect(info.description).toContain('충분한 휴식');
    });
  });

  describe('showNotification', () => {
    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();
      global.Notification = jest.fn() as any;
      global.Notification.permission = 'granted';
    });

    it('should create notification when permission is granted', () => {
      showNotification('Test Title', 'Test Body');
      expect(global.Notification).toHaveBeenCalledWith('Test Title', {
        body: 'Test Body',
        icon: '/favicon.ico',
        tag: 'pomodoro-timer',
      });
    });

    it('should not create notification when permission is denied', () => {
      global.Notification.permission = 'denied';
      showNotification('Test Title', 'Test Body');
      expect(global.Notification).not.toHaveBeenCalled();
    });
  });

  describe('updatePageTitle', () => {
    beforeEach(() => {
      // Reset document title
      document.title = 'Original Title';
    });

    it('should update page title with timer info when running', () => {
      updatePageTitle(1500, 'focus', true);
      expect(document.title).toContain('25:00');
      expect(document.title).toContain('🍅');
    });

    it('should reset to default title when not running', () => {
      updatePageTitle(1500, 'focus', false);
      expect(document.title).toBe('뽀모도로 타이머 - WooBottle Labs');
    });

    it('should show correct emoji for different phases', () => {
      updatePageTitle(300, 'shortBreak', true);
      expect(document.title).toContain('☕');
      
      updatePageTitle(900, 'longBreak', true);
      expect(document.title).toContain('🌴');
    });
  });

  describe('requestNotificationPermission', () => {
    beforeEach(() => {
      global.Notification.requestPermission = jest.fn();
    });

    it('should request notification permission', async () => {
      global.Notification.requestPermission.mockResolvedValue('granted');
      const result = await requestNotificationPermission();
      expect(result).toBe(true);
      expect(global.Notification.requestPermission).toHaveBeenCalled();
    });

    it('should return false when permission is denied', async () => {
      global.Notification.requestPermission.mockResolvedValue('denied');
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      global.Notification.requestPermission.mockRejectedValue(new Error('Test error'));
      const result = await requestNotificationPermission();
      expect(result).toBe(false);
    });
  });

  describe('getTodayString', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const today = new Date();
      const expected = today.toISOString().split('T')[0];
      expect(getTodayString()).toBe(expected);
    });

    it('should return consistent format', () => {
      const result = getTodayString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
