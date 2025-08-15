'use client';

import React from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8 max-w-6xl lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
