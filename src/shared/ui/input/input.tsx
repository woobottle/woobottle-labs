'use client';

import React from 'react';
import { cn } from 'shared/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  label?: string;
  error?: string;
  helperText?: string;
}

const variantClasses = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-red-400 dark:focus:ring-red-400',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500 dark:border-green-400 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-green-400 dark:focus:ring-green-400',
};

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const finalVariant = error ? 'error' : variant;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 border rounded-xl text-base',
          'focus:outline-none focus:ring-2 focus:ring-opacity-50',
          'transition-all duration-200',
          'disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700',
          variantClasses[finalVariant],
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <div className="mt-2">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {!error && helperText && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};
