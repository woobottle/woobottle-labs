'use client';

import React from 'react';

import { DiceRoller } from 'features/dice-roller';
import { AppLayout } from 'widgets/app-layout';

export const DiceRollerPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-2xl">🎲</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          주사위
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          6면체 주사위를 굴려보세요. 보드게임, 의사결정 등 다양한 상황에서 활용할 수 있습니다.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 p-12">
          <DiceRoller />
        </div>
      </div>
    </AppLayout>
  );
};
