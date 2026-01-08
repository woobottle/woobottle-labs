import type { DiceValue } from '../model/types';

export const rollDice = (): DiceValue => {
  return (Math.floor(Math.random() * 6) + 1) as DiceValue;
};
