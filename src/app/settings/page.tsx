'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Globe, Save, Bell, Palette } from 'lucide-react';
import AppLayout from '../../components/AppLayout';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'ko',
    notifications: true,
    fontSize: 'medium',
    autoSave: true,
    soundEnabled: false
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to localStorage or send to server
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const SettingCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
      {children}
    </div>
  );

  const SettingRow = ({ icon: Icon, title, description, children }: {
    icon: React.ComponentType<any>;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked ? 'bg-blue-600' : 'bg-gray-300'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );

  const Select = ({ value, onChange, options }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            설정
          </h1>
          <p className="text-gray-600 text-lg">
            앱 환경을 원하는 대로 설정하세요
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <SettingCard>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              외관 설정
            </h2>
            
            <div className="space-y-6">
              <SettingRow
                icon={settings.theme === 'dark' ? Moon : Sun}
                title="테마"
                description="라이트 모드 또는 다크 모드 선택"
              >
                <Select
                  value={settings.theme}
                  onChange={(value) => handleSettingChange('theme', value)}
                  options={[
                    { value: 'light', label: '라이트' },
                    { value: 'dark', label: '다크' },
                    { value: 'auto', label: '시스템 설정' }
                  ]}
                />
              </SettingRow>

              <SettingRow
                icon={Globe}
                title="언어"
                description="인터페이스 언어 설정"
              >
                <Select
                  value={settings.language}
                  onChange={(value) => handleSettingChange('language', value)}
                  options={[
                    { value: 'ko', label: '한국어' },
                    { value: 'en', label: 'English' },
                    { value: 'ja', label: '日本語' }
                  ]}
                />
              </SettingRow>

              <SettingRow
                icon={SettingsIcon}
                title="글꼴 크기"
                description="텍스트 크기 조정"
              >
                <Select
                  value={settings.fontSize}
                  onChange={(value) => handleSettingChange('fontSize', value)}
                  options={[
                    { value: 'small', label: '작게' },
                    { value: 'medium', label: '보통' },
                    { value: 'large', label: '크게' }
                  ]}
                />
              </SettingRow>
            </div>
          </SettingCard>

          {/* Functionality Settings */}
          <SettingCard>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              기능 설정
            </h2>
            
            <div className="space-y-6">
              <SettingRow
                icon={Bell}
                title="알림"
                description="브라우저 알림 허용"
              >
                <Toggle
                  checked={settings.notifications}
                  onChange={(checked) => handleSettingChange('notifications', checked)}
                />
              </SettingRow>

              <SettingRow
                icon={Save}
                title="자동 저장"
                description="텍스트 자동 저장 기능"
              >
                <Toggle
                  checked={settings.autoSave}
                  onChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </SettingRow>

              <SettingRow
                icon={SettingsIcon}
                title="사운드"
                description="버튼 클릭 및 알림 사운드"
              >
                <Toggle
                  checked={settings.soundEnabled}
                  onChange={(checked) => handleSettingChange('soundEnabled', checked)}
                />
              </SettingRow>
            </div>
          </SettingCard>

          {/* Data & Privacy */}
          <SettingCard>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              데이터 및 개인정보
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">데이터 저장</h4>
                <p className="text-sm text-blue-700">
                  모든 데이터는 브라우저에 로컬로 저장되며, 외부 서버로 전송되지 않습니다.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                  모든 데이터 삭제
                </button>
                <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                  데이터 내보내기
                </button>
              </div>
            </div>
          </SettingCard>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleSave}
              className={`
                px-8 py-3 rounded-xl font-semibold transition-all duration-200
                ${saved 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                {saved ? '저장됨!' : '설정 저장'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
