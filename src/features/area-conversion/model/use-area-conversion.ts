'use client';

import { useState, useCallback } from 'react';
import {
  validatePyeongInput,
  validateSquareMetersInput,
  formatAreaValue,
  type AreaInfo
} from 'entities/area';

export interface UseAreaConversionReturn {
  pyeongInput: string;
  squareMetersInput: string;
  pyeongResult: AreaInfo;
  squareMetersResult: AreaInfo;
  setPyeongInput: (value: string) => void;
  setSquareMetersInput: (value: string) => void;
  clearAll: () => void;
  swapValues: () => void;
}

export function useAreaConversion(): UseAreaConversionReturn {
  const [pyeongInput, setPyeongInputValue] = useState('');
  const [squareMetersInput, setSquareMetersInputValue] = useState('');

  const setPyeongInput = useCallback((value: string) => {
    setPyeongInputValue(value);
    if (value.trim()) {
      const result = validatePyeongInput(value);
      if (result.isValid) {
        setSquareMetersInputValue(formatAreaValue(result.squareMeters));
      }
    } else {
      setSquareMetersInputValue('');
    }
  }, []);

  const setSquareMetersInput = useCallback((value: string) => {
    setSquareMetersInputValue(value);
    if (value.trim()) {
      const result = validateSquareMetersInput(value);
      if (result.isValid) {
        setPyeongInputValue(formatAreaValue(result.pyeong));
      }
    } else {
      setPyeongInputValue('');
    }
  }, []);

  const clearAll = useCallback(() => {
    setPyeongInputValue('');
    setSquareMetersInputValue('');
  }, []);

  const swapValues = useCallback(() => {
    const tempPyeong = pyeongInput;
    const tempSquareMeters = squareMetersInput;
    
    setPyeongInputValue(tempSquareMeters);
    setSquareMetersInputValue(tempPyeong);
  }, [pyeongInput, squareMetersInput]);

  const pyeongResult = validatePyeongInput(pyeongInput);
  const squareMetersResult = validateSquareMetersInput(squareMetersInput);

  return {
    pyeongInput,
    squareMetersInput,
    pyeongResult,
    squareMetersResult,
    setPyeongInput,
    setSquareMetersInput,
    clearAll,
    swapValues,
  };
}
