"use client";

import React from "react";
import { cn } from "shared/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  default: "bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl",
  elevated: "bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl",
  bordered: "bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card: React.FC<CardProps> = ({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
