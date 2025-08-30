'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import AppLayout from '../../components/AppLayout';

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
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

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
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
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const Button = ({ onClick, className, children, ...props }: {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`
        h-16 rounded-xl font-semibold text-lg transition-all duration-200 
        active:scale-95 hover:shadow-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            계산기
          </h1>
          <p className="text-gray-600 text-lg">
            간단한 사칙연산 계산기
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6">
          {/* Display */}
          <div className="mb-6">
            <div className="bg-gray-100 rounded-xl p-4 text-right">
              <div className="text-3xl font-mono font-bold text-gray-800 min-h-[1.2em] break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button
              onClick={clear}
              className="col-span-2 bg-red-100 hover:bg-red-200 text-red-700"
            >
              <div className="flex items-center justify-center gap-2">
                <Trash2 className="w-5 h-5" />
                초기화
              </div>
            </Button>
            <Button
              onClick={() => inputOperation('÷')}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              ÷
            </Button>
            <Button
              onClick={() => inputOperation('×')}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              ×
            </Button>

            {/* Row 2 */}
            <Button
              onClick={() => inputNumber('7')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              7
            </Button>
            <Button
              onClick={() => inputNumber('8')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              8
            </Button>
            <Button
              onClick={() => inputNumber('9')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              9
            </Button>
            <Button
              onClick={() => inputOperation('-')}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              -
            </Button>

            {/* Row 3 */}
            <Button
              onClick={() => inputNumber('4')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              4
            </Button>
            <Button
              onClick={() => inputNumber('5')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              5
            </Button>
            <Button
              onClick={() => inputNumber('6')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              6
            </Button>
            <Button
              onClick={() => inputOperation('+')}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              +
            </Button>

            {/* Row 4 */}
            <Button
              onClick={() => inputNumber('1')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              1
            </Button>
            <Button
              onClick={() => inputNumber('2')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              2
            </Button>
            <Button
              onClick={() => inputNumber('3')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              3
            </Button>
            <Button
              onClick={performCalculation}
              className="row-span-2 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
            >
              =
            </Button>

            {/* Row 5 */}
            <Button
              onClick={() => inputNumber('0')}
              className="col-span-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              0
            </Button>
            <Button
              onClick={inputDot}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              .
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
