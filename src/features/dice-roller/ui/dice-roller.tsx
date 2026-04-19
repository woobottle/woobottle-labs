"use client";

import { useDiceRoller } from "../model/use-dice-roller";
import { DiceDisplay } from "./dice-display";

export const DiceRoller: React.FC = () => {
  const { value, isRolling, roll } = useDiceRoller();

  return (
    <div className="flex flex-col items-center gap-8">
      <DiceDisplay value={value} isRolling={isRolling} />

      <button
        onClick={roll}
        disabled={isRolling}
        className={`
          px-8 py-4 rounded-lg font-semibold text-base
          ${
            isRolling
              ? "bg-[#0A0A0A] border border-[#1A1A1A] text-[#525252] cursor-not-allowed"
              : "bg-white text-black hover:bg-neutral-200"
          }
        `}
      >
        {isRolling ? "굴리는 중..." : "주사위 굴리기"}
      </button>

      {value && !isRolling && (
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl px-6 py-4">
          <p className="text-[#A3A3A3] text-sm">
            결과:{" "}
            <span className="text-white text-xl font-semibold">{value}</span>
          </p>
        </div>
      )}
    </div>
  );
};
