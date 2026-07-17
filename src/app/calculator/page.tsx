"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import { ToolHeader } from "widgets/tool-header";

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string,
  ) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const Button = ({
    onClick,
    className,
    children,
    ...props
  }: {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`h-16 rounded-xl font-semibold text-lg transition-colors duration-150 ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  const numberBtn =
    "bg-[#0A0A0A] border border-[#1A1A1A] text-white hover:bg-[#141414]";
  const opBtn =
    "bg-[#0A0A0A] border border-[#1A1A1A] text-[#A3A3A3] hover:bg-[#141414]";
  const eqBtn = "bg-white text-black hover:bg-[#E5E5E5]";

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        <ToolHeader
          eyebrow="CALC"
          title="계산기"
          description="간단한 사칙연산"
        />

        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6">
          {/* Display */}
          <div className="mb-6">
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 text-right">
              <div className="text-3xl font-mono font-semibold text-white min-h-[1.2em] break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            <Button onClick={clear} className={`col-span-2 ${opBtn}`}>
              <div className="flex items-center justify-center gap-2">
                <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                초기화
              </div>
            </Button>
            <Button onClick={() => inputOperation("÷")} className={opBtn}>
              ÷
            </Button>
            <Button onClick={() => inputOperation("×")} className={opBtn}>
              ×
            </Button>

            <Button onClick={() => inputNumber("7")} className={numberBtn}>
              7
            </Button>
            <Button onClick={() => inputNumber("8")} className={numberBtn}>
              8
            </Button>
            <Button onClick={() => inputNumber("9")} className={numberBtn}>
              9
            </Button>
            <Button onClick={() => inputOperation("-")} className={opBtn}>
              -
            </Button>

            <Button onClick={() => inputNumber("4")} className={numberBtn}>
              4
            </Button>
            <Button onClick={() => inputNumber("5")} className={numberBtn}>
              5
            </Button>
            <Button onClick={() => inputNumber("6")} className={numberBtn}>
              6
            </Button>
            <Button onClick={() => inputOperation("+")} className={opBtn}>
              +
            </Button>

            <Button onClick={() => inputNumber("1")} className={numberBtn}>
              1
            </Button>
            <Button onClick={() => inputNumber("2")} className={numberBtn}>
              2
            </Button>
            <Button onClick={() => inputNumber("3")} className={numberBtn}>
              3
            </Button>
            <Button
              onClick={performCalculation}
              className={`row-span-2 ${eqBtn}`}
            >
              =
            </Button>

            <Button
              onClick={() => inputNumber("0")}
              className={`col-span-2 ${numberBtn}`}
            >
              0
            </Button>
            <Button onClick={inputDot} className={numberBtn}>
              .
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
