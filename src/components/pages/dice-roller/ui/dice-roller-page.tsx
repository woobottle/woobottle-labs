"use client";

import React from "react";

import { DiceRoller } from "features/dice-roller";
import { AppLayout } from "widgets/app-layout";

export const DiceRollerPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="mb-10">
        <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">
          DICE
        </div>
        <h1 className="text-3xl font-semibold text-white">주사위</h1>
        <p className="mt-2 text-[#A3A3A3]">6면체 주사위 굴리기</p>
      </div>

      <div className="flex justify-center">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-12">
          <DiceRoller />
        </div>
      </div>
    </AppLayout>
  );
};
