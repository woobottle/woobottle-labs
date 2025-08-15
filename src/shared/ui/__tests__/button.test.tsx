import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button/button';

describe('Button', () => {
  describe('렌더링', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render as button element', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should apply default variant styles', () => {
      render(<Button variant="default">Default</Button>);
      const button = screen.getByText('Default');
      expect(button).toHaveClass('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
    });

    it('should apply primary variant styles', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByText('Primary');
      expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-indigo-600');
    });

    it('should apply secondary variant styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByText('Secondary');
      expect(button).toHaveClass('bg-gray-500', 'hover:bg-gray-600');
    });

    it('should apply success variant styles', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByText('Success');
      expect(button).toHaveClass('bg-gradient-to-r', 'from-green-500', 'to-green-600');
    });

    it('should apply danger variant styles', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByText('Danger');
      expect(button).toHaveClass('bg-red-500', 'hover:bg-red-600');
    });

    it('should apply warning variant styles', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByText('Warning');
      expect(button).toHaveClass('bg-yellow-500', 'hover:bg-yellow-600');
    });
  });

  describe('sizes', () => {
    it('should apply small size styles', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByText('Small');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should apply medium size styles (default)', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByText('Medium');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should apply large size styles', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByText('Large');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('상태', () => {
    it('should be enabled by default', () => {
      render(<Button>Enabled</Button>);
      const button = screen.getByText('Enabled');
      expect(button).not.toBeDisabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText('Disabled');
      expect(button).toBeDisabled();
    });

    it('should apply disabled styles when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByText('Disabled');
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('이벤트', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick} disabled>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('커스텀 props', () => {
    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByText('Custom');
      expect(button).toHaveClass('custom-class');
    });

    it('should forward other props to button element', () => {
      render(<Button data-testid="custom-button" type="submit">Submit</Button>);
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('기본 스타일', () => {
    it('should always have base styles', () => {
      render(<Button>Base</Button>);
      const button = screen.getByText('Base');
      expect(button).toHaveClass(
        'rounded-xl',
        'font-semibold',
        'transition-all',
        'duration-200',
        'active:scale-95',
        'hover:shadow-lg'
      );
    });
  });
});
