'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Calculator, 
  Settings, 
  Info, 
  Menu, 
  X,
  Home,
  Hash,
  Clock,
  BarChart3,
  Smartphone,
  Home as HomeIcon
} from 'lucide-react';
import { ThemeToggle } from '../../../shared/ui/theme-toggle';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: '홈',
    href: '/',
    icon: Home,
    description: '대시보드'
  },
  {
    id: 'text-counter',
    label: '글자수 카운터',
    href: '/text-counter',
    icon: FileText,
    description: '실시간 텍스트 분석'
  },
  {
    id: 'calculator',
    label: '계산기',
    href: '/calculator',
    icon: Calculator,
    description: '간단한 계산기'
  },
  {
    id: 'icon-generator',
    label: '아이콘 생성기',
    href: '/icon-generator',
    icon: Smartphone,
    description: '앱 아이콘 자동 생성'
  },
  {
    id: 'area-converter',
    label: '평수 변환기',
    href: '/area-converter',
    icon: HomeIcon,
    description: '평수 ↔ 제곱미터 변환'
  },
  {
    id: 'statistics',
    label: '통계 분석',
    href: '/statistics',
    icon: BarChart3,
    description: '텍스트 통계 상세'
  },
  {
    id: 'timer',
    label: '뽀모도로 타이머',
    href: '/timer',
    icon: Clock,
    description: '집중력 향상 시간 관리'
  },
  {
    id: 'settings',
    label: '설정',
    href: '/settings',
    icon: Settings,
    description: '앱 설정'
  },
  {
    id: 'about',
    label: '정보',
    href: '/about',
    icon: Info,
    description: '앱 정보'
  }
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/90 transition-all duration-200 dark:bg-gray-800/80 dark:border-gray-700/30 dark:hover:bg-gray-700/90"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-white/30 shadow-xl z-40
        dark:bg-gray-900/90 dark:border-gray-700/30
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">WooBottle</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">생산성 도구</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-[1.02]' 
                      : 'text-gray-700 hover:bg-white/60 hover:shadow-md dark:text-gray-300 dark:hover:bg-gray-800/60'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 dark:bg-gray-800'
                    }
                  `}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                      {item.label}
                    </p>
                    {item.description && (
                      <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="absolute bottom-20 left-0 right-0 p-4">
          <ThemeToggle />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2024 WooBottle Labs</p>
          </div>
        </div>
      </div>
    </>
  );
};
