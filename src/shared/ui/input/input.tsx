"use client";

import React from "react";
import { cn } from "shared/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "error" | "success";
  label?: string;
  error?: string;
  helperText?: string;
}

const variantClasses = {
  default: "border-[#1A1A1A] focus:border-white",
  error: "border-red-500/60 focus:border-red-500/80",
  success: "border-[#2A2A2A] focus:border-white",
};

export const Input: React.FC<InputProps> = ({
  variant = "default",
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const finalVariant = error ? "error" : variant;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#A3A3A3] mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full px-4 py-3 rounded-lg text-base",
          "bg-[#0A0A0A] text-white placeholder:text-[#525252]",
          "border focus:outline-none transition-colors duration-150",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantClasses[finalVariant],
          className,
        )}
        {...props}
      />
      {(error || helperText) && (
        <div className="mt-2">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && helperText && (
            <p className="text-sm text-[#525252]">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};
