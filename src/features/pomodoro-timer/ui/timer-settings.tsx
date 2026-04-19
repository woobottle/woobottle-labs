"use client";

import React, { useState } from "react";
import { Button } from "shared/ui/button";
import { Input } from "shared/ui/input";
import { Card } from "shared/ui/card";
import { Settings, X, Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { TimerSettings as TimerSettingsType } from "entities/timer";

interface TimerSettingsProps {
  settings: TimerSettingsType;
  onUpdateSettings: (settings: Partial<TimerSettingsType>) => void;
  notificationPermission: boolean;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({
  settings,
  onUpdateSettings,
  notificationPermission,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsOpen(false);
  };

  const handleInputChange = (
    field: keyof TimerSettingsType,
    value: number | boolean,
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) {
    return (
      <Button
        variant="default"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Settings className="w-4 h-4" strokeWidth={1.5} />
        설정
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card
        className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        padding="none"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]">
          <h2 className="text-xl font-bold text-white">타이머 설정</h2>
          <Button
            variant="default"
            size="sm"
            onClick={handleCancel}
            className="p-2"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* 시간 설정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">시간 설정 (분)</h3>

            <Input
              label="집중 시간"
              type="number"
              min="1"
              max="60"
              value={localSettings.focusTime}
              onChange={(e) =>
                handleInputChange("focusTime", parseInt(e.target.value) || 25)
              }
              helperText="집중해서 작업할 시간을 설정하세요"
            />

            <Input
              label="짧은 휴식"
              type="number"
              min="1"
              max="30"
              value={localSettings.shortBreakTime}
              onChange={(e) =>
                handleInputChange(
                  "shortBreakTime",
                  parseInt(e.target.value) || 5,
                )
              }
              helperText="짧은 휴식 시간을 설정하세요"
            />

            <Input
              label="긴 휴식"
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreakTime}
              onChange={(e) =>
                handleInputChange(
                  "longBreakTime",
                  parseInt(e.target.value) || 15,
                )
              }
              helperText="긴 휴식 시간을 설정하세요"
            />

            <Input
              label="긴 휴식까지의 세션 수"
              type="number"
              min="2"
              max="10"
              value={localSettings.sessionsUntilLongBreak}
              onChange={(e) =>
                handleInputChange(
                  "sessionsUntilLongBreak",
                  parseInt(e.target.value) || 4,
                )
              }
              helperText="몇 번의 집중 세션 후에 긴 휴식을 가질지 설정하세요"
            />
          </div>

          {/* 자동 시작 설정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">자동 시작</h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoStartBreaks}
                onChange={(e) =>
                  handleInputChange("autoStartBreaks", e.target.checked)
                }
                className="w-4 h-4 bg-[#0A0A0A] border-[#1A1A1A] rounded focus:ring-white focus:ring-1"
              />
              <span className="text-[#A3A3A3]">휴식 시간 자동 시작</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoStartPomodoros}
                onChange={(e) =>
                  handleInputChange("autoStartPomodoros", e.target.checked)
                }
                className="w-4 h-4 bg-[#0A0A0A] border-[#1A1A1A] rounded focus:ring-white focus:ring-1"
              />
              <span className="text-[#A3A3A3]">집중 시간 자동 시작</span>
            </label>
          </div>

          {/* 알림 설정 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">알림 설정</h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.enableNotifications}
                onChange={(e) =>
                  handleInputChange("enableNotifications", e.target.checked)
                }
                className="w-4 h-4 bg-[#0A0A0A] border-[#1A1A1A] rounded focus:ring-white focus:ring-1"
              />
              <div className="flex items-center space-x-2">
                {localSettings.enableNotifications ? (
                  <Bell className="w-4 h-4 text-white" strokeWidth={1.5} />
                ) : (
                  <BellOff
                    className="w-4 h-4 text-[#525252]"
                    strokeWidth={1.5}
                  />
                )}
                <span className="text-[#A3A3A3]">브라우저 알림 활성화</span>
              </div>
            </label>

            {!notificationPermission && localSettings.enableNotifications && (
              <div className="text-sm text-[#A3A3A3] bg-[#0A0A0A] border border-[#1A1A1A] p-3 rounded-lg">
                ⚠️ 브라우저 알림 권한이 필요합니다. 브라우저 설정에서 알림을
                허용해주세요.
              </div>
            )}

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.enableSounds}
                onChange={(e) =>
                  handleInputChange("enableSounds", e.target.checked)
                }
                className="w-4 h-4 bg-[#0A0A0A] border-[#1A1A1A] rounded focus:ring-white focus:ring-1"
              />
              <div className="flex items-center space-x-2">
                {localSettings.enableSounds ? (
                  <Volume2 className="w-4 h-4 text-white" strokeWidth={1.5} />
                ) : (
                  <VolumeX
                    className="w-4 h-4 text-[#525252]"
                    strokeWidth={1.5}
                  />
                )}
                <span className="text-[#A3A3A3]">알림 소리 활성화</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-[#1A1A1A]">
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSave}>
            저장
          </Button>
        </div>
      </Card>
    </div>
  );
};
