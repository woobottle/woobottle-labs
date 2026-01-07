'use client';

import { useState, useCallback } from 'react';

import { type DiceValue, rollDice } from 'entities/dice';

export const useDiceRoller = () => {
  const [value, setValue] = useState<DiceValue | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const roll = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);

    const animationInterval = setInterval(() => {
      setValue(rollDice());
    }, 50);

    setTimeout(() => {
      clearInterval(animationInterval);
      setValue(rollDice());
      setIsRolling(false);
    }, 500);
  }, [isRolling]);

  return {
    value,
    isRolling,
    roll,
  };
};
