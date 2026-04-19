"use client";

import React from "react";
import { cn } from "shared/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  default:
    "border border-[#1A1A1A] bg-[#0A0A0A] text-white hover:border-[#2A2A2A]",
  primary: "bg-white text-black hover:bg-neutral-200",
  secondary: "border border-[#2A2A2A] text-white hover:border-white",
  success:
    "border border-[#1A1A1A] bg-[#0A0A0A] text-white hover:border-[#2A2A2A]",
  danger: "border border-[#2A2A2A] text-white hover:border-red-500/60",
  warning: "border border-[#2A2A2A] text-white hover:border-[#2A2A2A]",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
