"use client";

import React from "react";

import { DiceRoller } from "features/dice-roller";
import { AppLayout } from "widgets/app-layout";
import { ToolHeader } from "widgets/tool-header";

export const DiceRollerPage: React.FC = () => {
  return (
    <AppLayout>
      <ToolHeader
        eyebrow="DICE"
        title="주사위"
        description="6면체 주사위 굴리기"
      />

      <div className="flex justify-center">
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-12">
          <DiceRoller />
        </div>
      </div>
    </AppLayout>
  );
};
