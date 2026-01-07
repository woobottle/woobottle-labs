'use client';

import { useDiceRoller } from '../model/use-dice-roller';
import { DiceDisplay } from './dice-display';

export const DiceRoller: React.FC = () => {
  const { value, isRolling, roll } = useDiceRoller();

  return (
    <div className="flex flex-col items-center gap-8">
      <DiceDisplay value={value} isRolling={isRolling} />

      <button
        onClick={roll}
        disabled={isRolling}
        className={`
          px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200
          ${
            isRolling
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-105'
          }
        `}
      >
        {isRolling ? '굴리는 중...' : '주사위 굴리기'}
      </button>

      {value && !isRolling && (
        <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          결과: <span className="text-blue-600 dark:text-blue-400">{value}</span>
        </p>
      )}
    </div>
  );
};
