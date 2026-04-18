"use client";

import React from "react";
import { Sidebar } from "widgets/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-black text-white">
      <Sidebar />
      <div className="lg:ml-64">
        <div className="container mx-auto px-4 py-8 max-w-6xl lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};
