import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimerControls } from '../ui/timer-controls';

describe('TimerControls', () => {
  const mockHandlers = {
    onStart: jest.fn(),
    onPause: jest.fn(),
    onReset: jest.fn(),
    onSkip: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('버튼 표시', () => {
    it('should show start button when timer is idle', () => {
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('시작')).toBeInTheDocument();
      expect(screen.queryByText('일시정지')).not.toBeInTheDocument();
      expect(screen.queryByText('계속하기')).not.toBeInTheDocument();
    });

    it('should show pause button when timer is running', () => {
      render(
        <TimerControls
          isRunning={true}
          isPaused={false}
          isIdle={false}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('일시정지')).toBeInTheDocument();
      expect(screen.queryByText('시작')).not.toBeInTheDocument();
      expect(screen.queryByText('계속하기')).not.toBeInTheDocument();
    });

    it('should show continue button when timer is paused', () => {
      render(
        <TimerControls
          isRunning={false}
          isPaused={true}
          isIdle={false}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('계속하기')).toBeInTheDocument();
      expect(screen.queryByText('시작')).not.toBeInTheDocument();
      expect(screen.queryByText('일시정지')).not.toBeInTheDocument();
    });

    it('should always show reset and skip buttons', () => {
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('리셋')).toBeInTheDocument();
      expect(screen.getByText('건너뛰기')).toBeInTheDocument();
    });
  });

  describe('버튼 상태', () => {
    it('should disable reset button when timer is idle', () => {
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      const resetButton = screen.getByText('리셋');
      expect(resetButton).toBeDisabled();
    });

    it('should enable reset button when timer is not idle', () => {
      render(
        <TimerControls
          isRunning={true}
          isPaused={false}
          isIdle={false}
          {...mockHandlers}
        />
      );

      const resetButton = screen.getByText('리셋');
      expect(resetButton).not.toBeDisabled();
    });

    it('should enable skip button always', () => {
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      const skipButton = screen.getByText('건너뛰기');
      expect(skipButton).not.toBeDisabled();
    });
  });

  describe('버튼 클릭 이벤트', () => {
    it('should call onStart when start button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      const startButton = screen.getByRole('button', { name: /시작/ });
      await user.click(startButton);

      expect(mockHandlers.onStart).toHaveBeenCalledTimes(1);
    });

    it('should call onStart when continue button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TimerControls
          isRunning={false}
          isPaused={true}
          isIdle={false}
          {...mockHandlers}
        />
      );

      const continueButton = screen.getByRole('button', { name: /계속하기/ });
      await user.click(continueButton);

      expect(mockHandlers.onStart).toHaveBeenCalledTimes(1);
    });

    it('should call onPause when pause button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TimerControls
          isRunning={true}
          isPaused={false}
          isIdle={false}
          {...mockHandlers}
        />
      );

      const pauseButton = screen.getByRole('button', { name: /일시정지/ });
      await user.click(pauseButton);

      expect(mockHandlers.onPause).toHaveBeenCalledTimes(1);
    });

    it('should call onReset when reset button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TimerControls
          isRunning={true}
          isPaused={false}
          isIdle={false}
          {...mockHandlers}
        />
      );

      const resetButton = screen.getByRole('button', { name: /리셋/ });
      await user.click(resetButton);

      expect(mockHandlers.onReset).toHaveBeenCalledTimes(1);
    });

    it('should call onSkip when skip button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      const skipButton = screen.getByRole('button', { name: /건너뛰기/ });
      await user.click(skipButton);

      expect(mockHandlers.onSkip).toHaveBeenCalledTimes(1);
    });
  });

  describe('아이콘 표시', () => {
    it('should show play icon in start button', () => {
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      // Lucide React icons are rendered as SVG elements
      const startButton = screen.getByText('시작').closest('button');
      const playIcon = startButton?.querySelector('svg');
      expect(playIcon).toBeInTheDocument();
    });

    it('should show pause icon in pause button', () => {
      render(
        <TimerControls
          isRunning={true}
          isPaused={false}
          isIdle={false}
          {...mockHandlers}
        />
      );

      const pauseButton = screen.getByText('일시정지').closest('button');
      const pauseIcon = pauseButton?.querySelector('svg');
      expect(pauseIcon).toBeInTheDocument();
    });

    it('should show reset icon in reset button', () => {
      render(
        <TimerControls
          isRunning={true}
          isPaused={false}
          isIdle={false}
          {...mockHandlers}
        />
      );

      const resetButton = screen.getByText('리셋').closest('button');
      const resetIcon = resetButton?.querySelector('svg');
      expect(resetIcon).toBeInTheDocument();
    });

    it('should show skip icon in skip button', () => {
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      const skipButton = screen.getByText('건너뛰기').closest('button');
      const skipIcon = skipButton?.querySelector('svg');
      expect(skipIcon).toBeInTheDocument();
    });
  });

  describe('버튼 스타일', () => {
    it('should apply correct variant classes to buttons', () => {
      render(
        <TimerControls
          isRunning={false}
          isPaused={false}
          isIdle={true}
          {...mockHandlers}
        />
      );

      const startButton = screen.getByText('시작');
      const resetButton = screen.getByText('리셋');
      const skipButton = screen.getByText('건너뛰기');

      // Check if buttons have the expected base classes
      expect(startButton).toHaveClass('rounded-xl', 'font-semibold');
      expect(resetButton).toHaveClass('rounded-xl', 'font-semibold');
      expect(skipButton).toHaveClass('rounded-xl', 'font-semibold');
    });

    it('should apply warning variant to pause button', () => {
      render(
        <TimerControls
          isRunning={true}
          isPaused={false}
          isIdle={false}
          {...mockHandlers}
        />
      );

      const pauseButton = screen.getByText('일시정지');
      expect(pauseButton).toHaveClass('bg-yellow-500');
    });
  });
});
