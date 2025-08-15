'use client';

import React from 'react';
import { cn } from 'shared/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses = {
  default: 'bg-white rounded-xl shadow-sm dark:bg-gray-800 dark:shadow-gray-900/20',
  elevated: 'bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30',
  bordered: 'bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
