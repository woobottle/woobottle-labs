import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PomodoroTimer } from '../ui/pomodoro-timer';

// Don't mock the hook for integration tests
jest.unmock('../model/use-pomodoro-timer');

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

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  value: jest.fn(() => true),
  writable: true,
});

describe('Pomodoro Timer Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockLocalStorage.getItem.mockReturnValue(null);
    document.title = 'Test';
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('전체 워크플로우', () => {
    it('should complete a full pomodoro cycle', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Initial state - focus phase
      expect(screen.getByText('🍅 집중 시간')).toBeInTheDocument();
      expect(screen.getByText('25:00')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Current session

      // Start timer
      const startButton = screen.getByText('시작');
      await user.click(startButton);

      // Timer should be running
      expect(screen.getByText('일시정지')).toBeInTheDocument();

      // Fast forward to near completion (set to 1 minute for testing)
      // First, change settings to make test faster
      const settingsButton = screen.getByText('설정');
      await user.click(settingsButton);

      const focusTimeInput = screen.getByDisplayValue('25');
      await user.clear(focusTimeInput);
      await user.type(focusTimeInput, '1');

      const saveButton = screen.getByText('저장');
      await user.click(saveButton);

      // Start timer again with new settings
      const newStartButton = screen.getByText('시작');
      await user.click(newStartButton);

      // Fast forward 1 minute to complete focus session
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      // Should transition to short break
      await waitFor(() => {
        expect(screen.getByText('☕ 짧은 휴식')).toBeInTheDocument();
      });

      expect(screen.getByText('1')).toBeInTheDocument(); // Completed sessions
    });

    it('should handle pause and resume correctly', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Start timer
      const startButton = screen.getByText('시작');
      await user.click(startButton);

      // Let it run for 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Pause timer
      const pauseButton = screen.getByText('일시정지');
      await user.click(pauseButton);

      expect(screen.getByText('계속하기')).toBeInTheDocument();

      const timeWhenPaused = screen.getByText(/24:5[0-9]/); // Should be around 24:55
      expect(timeWhenPaused).toBeInTheDocument();

      // Wait 5 more seconds while paused
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Time should not have changed
      expect(screen.getByText(/24:5[0-9]/)).toBeInTheDocument();

      // Resume timer
      const continueButton = screen.getByText('계속하기');
      await user.click(continueButton);

      // Timer should continue counting down
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/24:5[0-9]/)).toBeInTheDocument();
    });

    it('should reset timer correctly', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Start timer
      const startButton = screen.getByText('시작');
      await user.click(startButton);

      // Let it run for 10 seconds
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // Time should have decreased
      expect(screen.getByText(/24:5[0-9]/)).toBeInTheDocument();

      // Reset timer
      const resetButton = screen.getByText('리셋');
      await user.click(resetButton);

      // Should be back to initial state
      expect(screen.getByText('25:00')).toBeInTheDocument();
      expect(screen.getByText('시작')).toBeInTheDocument();
    });

    it('should skip phases correctly', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Initial focus phase
      expect(screen.getByText('🍅 집중 시간')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Completed sessions

      // Skip to break
      const skipButton = screen.getByText('건너뛰기');
      await user.click(skipButton);

      // Should be in short break
      expect(screen.getByText('☕ 짧은 휴식')).toBeInTheDocument();
      expect(screen.getByText('05:00')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Completed sessions

      // Skip break
      const skipButton2 = screen.getByText('건너뛰기');
      await user.click(skipButton2);

      // Should be back to focus
      expect(screen.getByText('🍅 집중 시간')).toBeInTheDocument();
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });
  });

  describe('설정 변경', () => {
    it('should update timer when settings change', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Open settings
      const settingsButton = screen.getByText('설정');
      await user.click(settingsButton);

      // Change focus time to 30 minutes
      const focusTimeInput = screen.getByDisplayValue('25');
      await user.clear(focusTimeInput);
      await user.type(focusTimeInput, '30');

      // Change short break to 10 minutes
      const shortBreakInput = screen.getByDisplayValue('5');
      await user.clear(shortBreakInput);
      await user.type(shortBreakInput, '10');

      // Save settings
      const saveButton = screen.getByText('저장');
      await user.click(saveButton);

      // Timer should reflect new settings
      expect(screen.getByText('30:00')).toBeInTheDocument();

      // Skip to break to test short break time
      const skipButton = screen.getByText('건너뛰기');
      await user.click(skipButton);

      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    it('should handle auto-start settings', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Open settings
      const settingsButton = screen.getByText('설정');
      await user.click(settingsButton);

      // Enable auto-start breaks
      const autoStartBreaksCheckbox = screen.getByRole('checkbox', { name: /휴식 시간 자동 시작/ });
      await user.click(autoStartBreaksCheckbox);

      // Set short timer for testing
      const focusTimeInput = screen.getByDisplayValue('25');
      await user.clear(focusTimeInput);
      await user.type(focusTimeInput, '1');

      const saveButton = screen.getByText('저장');
      await user.click(saveButton);

      // Start timer
      const startButton = screen.getByText('시작');
      await user.click(startButton);

      // Complete focus session
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      // Break should auto-start
      await waitFor(() => {
        expect(screen.getByText('☕ 짧은 휴식')).toBeInTheDocument();
        expect(screen.getByText('일시정지')).toBeInTheDocument(); // Should be running
      });
    });
  });

  describe('통계 추적', () => {
    it('should update statistics when sessions complete', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Initial stats should be zero - use more specific selectors
      expect(screen.getByText('총 집중 시간').parentElement?.querySelector('.text-2xl')).toHaveTextContent('0분');
      expect(screen.getByText('총 완료 세션').parentElement?.querySelector('.text-2xl')).toHaveTextContent('0');

      // Set short timer and complete a session
      const settingsButton = screen.getByText('설정');
      await user.click(settingsButton);

      const focusTimeInput = screen.getByDisplayValue('25');
      await user.clear(focusTimeInput);
      await user.type(focusTimeInput, '1');

      const saveButton = screen.getByText('저장');
      await user.click(saveButton);

      const startButton = screen.getByText('시작');
      await user.click(startButton);

      // Complete session
      act(() => {
        jest.advanceTimersByTime(60000);
      });

      // Stats should update
      await waitFor(() => {
        expect(screen.getByText('총 집중 시간').parentElement?.querySelector('.text-2xl')).toHaveTextContent('1분');
        expect(screen.getByText('총 완료 세션').parentElement?.querySelector('.text-2xl')).toHaveTextContent('1');
      });
    });

    it('should reset statistics when requested', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Mock some existing stats
      const mockStats = {
        totalFocusTime: 100,
        totalSessions: 4,
        todayFocusTime: 25,
        todaySessions: 1,
        streak: 3,
      };
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'pomodoro-stats') {
          return JSON.stringify(mockStats);
        }
        return null;
      });

      // Re-render to pick up mocked stats
      render(<PomodoroTimer />);

      // Reset stats - use more specific selector
      const resetStatsButton = screen.getByText('통계').parentElement?.querySelector('button:has-text("초기화")') || screen.getAllByText('초기화')[0];
      await user.click(resetStatsButton);

      // Confirm dialog should appear and be accepted (mocked to return true)
      expect(window.confirm).toHaveBeenCalled();

      // Stats should be reset to zero
      await waitFor(() => {
        expect(screen.getByText('총 집중 시간').parentElement?.querySelector('.text-2xl')).toHaveTextContent('0분');
        expect(screen.getByText('총 완료 세션').parentElement?.querySelector('.text-2xl')).toHaveTextContent('0');
      });
    });
  });

  describe('로컬 스토리지 지속성', () => {
    it('should save and restore timer state', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<PomodoroTimer />);

      // Start timer and let it run
      const startButton = screen.getByText('시작');
      await user.click(startButton);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Verify localStorage was called to save state
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'pomodoro-state',
        expect.stringContaining('"status":"running"')
      );
    });
  });
});

// Helper function for act() calls
function act(callback: () => void) {
  callback();
}
