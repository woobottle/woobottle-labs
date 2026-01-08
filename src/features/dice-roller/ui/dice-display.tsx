'use client';

import type { DiceValue } from 'entities/dice';

interface DiceDisplayProps {
  value: DiceValue | null;
  isRolling: boolean;
}

const dotPositions: Record<DiceValue, string[]> = {
  1: ['top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'],
  2: ['top-4 right-4', 'bottom-4 left-4'],
  3: ['top-4 right-4', 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', 'bottom-4 left-4'],
  4: ['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'],
  5: [
    'top-4 left-4',
    'top-4 right-4',
    'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-4 left-4',
    'bottom-4 right-4',
  ],
  6: [
    'top-4 left-4',
    'top-4 right-4',
    'top-1/2 left-4 -translate-y-1/2',
    'top-1/2 right-4 -translate-y-1/2',
    'bottom-4 left-4',
    'bottom-4 right-4',
  ],
};

export const DiceDisplay: React.FC<DiceDisplayProps> = ({ value, isRolling }) => {
  return (
    <div
      className={`
        relative w-32 h-32 bg-white rounded-2xl shadow-xl border-2 border-gray-200
        dark:bg-gray-800 dark:border-gray-600
        ${isRolling ? 'animate-bounce' : ''}
      `}
    >
      {value &&
        dotPositions[value].map((position, index) => (
          <div
            key={index}
            className={`
              absolute w-5 h-5 bg-gray-800 rounded-full
              dark:bg-gray-200
              ${position}
            `}
          />
        ))}
      {!value && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg">
          ?
        </div>
      )}
    </div>
  );
};
