import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimerDisplay } from '../ui/timer-display';

describe('TimerDisplay', () => {
  const defaultProps = {
    timeLeft: 1500, // 25 minutes
    totalTime: 1500,
    phase: 'focus' as const,
    currentSession: 1,
    completedSessions: 0,
    isRunning: false,
  };

  describe('시간 표시', () => {
    it('should display time in MM:SS format', () => {
      render(<TimerDisplay {...defaultProps} />);
      expect(screen.getByText('25:00')).toBeInTheDocument();
    });

    it('should display different time values correctly', () => {
      render(<TimerDisplay {...defaultProps} timeLeft={300} />);
      expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    it('should display seconds correctly', () => {
      render(<TimerDisplay {...defaultProps} timeLeft={90} />);
      expect(screen.getByText('01:30')).toBeInTheDocument();
    });
  });

  describe('페이즈별 표시', () => {
    it('should display focus phase correctly', () => {
      render(<TimerDisplay {...defaultProps} phase="focus" />);
      
      expect(screen.getByText('🍅')).toBeInTheDocument();
      expect(screen.getByText('집중 시간')).toBeInTheDocument();
    });

    it('should display short break phase correctly', () => {
      render(<TimerDisplay {...defaultProps} phase="shortBreak" />);
      
      expect(screen.getByText('☕')).toBeInTheDocument();
      expect(screen.getByText('짧은 휴식')).toBeInTheDocument();
    });

    it('should display long break phase correctly', () => {
      render(<TimerDisplay {...defaultProps} phase="longBreak" />);
      
      expect(screen.getByText('🌴')).toBeInTheDocument();
      expect(screen.getByText('긴 휴식')).toBeInTheDocument();
    });
  });

  describe('진행률 표시', () => {
    it('should show progress correctly', () => {
      // 50% progress (750 seconds left out of 1500)
      render(<TimerDisplay {...defaultProps} timeLeft={750} />);
      
      // SVG circle should be present for progress indication
      const progressCircle = document.querySelector('circle[stroke-dasharray]');
      expect(progressCircle).toBeInTheDocument();
    });

    it('should show full progress when time is up', () => {
      render(<TimerDisplay {...defaultProps} timeLeft={0} />);
      
      const progressCircle = document.querySelector('circle[stroke-dasharray]');
      expect(progressCircle).toBeInTheDocument();
    });
  });

  describe('실행 상태 표시', () => {
    it('should show running indicator when timer is running', () => {
      render(<TimerDisplay {...defaultProps} isRunning={true} />);
      
      // Should show pulsing dot
      const runningIndicator = document.querySelector('.animate-pulse');
      expect(runningIndicator).toBeInTheDocument();
    });

    it('should not show running indicator when timer is not running', () => {
      render(<TimerDisplay {...defaultProps} isRunning={false} />);
      
      const runningIndicator = document.querySelector('.animate-pulse');
      expect(runningIndicator).not.toBeInTheDocument();
    });
  });

  describe('세션 정보', () => {
    it('should display current session number', () => {
      render(<TimerDisplay {...defaultProps} currentSession={3} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('현재 세션')).toBeInTheDocument();
    });

    it('should display completed sessions count', () => {
      render(<TimerDisplay {...defaultProps} completedSessions={5} />);
      
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('완료된 세션')).toBeInTheDocument();
    });
  });

  describe('색상 테마', () => {
    it('should apply focus phase colors', () => {
      render(<TimerDisplay {...defaultProps} phase="focus" />);
      
      const timeDisplay = screen.getByText('25:00');
      expect(timeDisplay).toHaveClass('text-red-600', 'dark:text-red-400');
    });

    it('should apply short break phase colors', () => {
      render(<TimerDisplay {...defaultProps} phase="shortBreak" />);
      
      const phaseLabel = screen.getByText('짧은 휴식');
      expect(phaseLabel).toHaveClass('text-green-600', 'dark:text-green-400');
    });

    it('should apply long break phase colors', () => {
      render(<TimerDisplay {...defaultProps} phase="longBreak" />);
      
      const phaseLabel = screen.getByText('긴 휴식');
      expect(phaseLabel).toHaveClass('text-blue-600', 'dark:text-blue-400');
    });
  });
});
