'use client';

import React from 'react';
import { Sidebar } from 'widgets/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 max-w-6xl lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};
