'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../card';
import { Button } from '../button';

interface AppVersionInfo {
  name: string;
  version: string;
  packageVersion: string;
  description: string;
  buildTime: string;
  buildNumber: string;
  buildId: string;
  git: {
    commitHash: string;
    shortHash: string;
    branch: string;
    commitDate: string;
    commitMessage: string;
    tag: string;
  };
  environment: string;
  ci: boolean;
  debug: {
    nodeVersion: string;
    platform: string;
    arch: string;
  };
}

interface VersionInfoProps {
  className?: string;
  compact?: boolean;
}

export const VersionInfo: React.FC<VersionInfoProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. 전역 변수에서 버전 정보 확인
    if (typeof window !== 'undefined' && window.__APP_VERSION__) {
      setVersionInfo(window.__APP_VERSION__);
      return;
    }

    // 2. API에서 버전 정보 가져오기
    fetch('/version.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data: AppVersionInfo) => {
        setVersionInfo(data);
      })
      .catch(err => {
        console.warn('버전 정보를 가져올 수 없습니다:', err);
        setError(err.message);
      });
  }, []);

  const copyVersionInfo = () => {
    if (!versionInfo) return;
    
    const info = `
WooBottle Labs - 버전 정보
========================
버전: ${versionInfo.version}
빌드 시간: ${versionInfo.buildTime}
커밋: ${versionInfo.git.shortHash} (${versionInfo.git.branch})
환경: ${versionInfo.environment}
빌드 번호: ${versionInfo.buildNumber}
커밋 메시지: ${versionInfo.git.commitMessage}
    `.trim();
    
    navigator.clipboard.writeText(info).then(() => {
      alert('버전 정보가 클립보드에 복사되었습니다!');
    });
  };

  const openCommitOnGitHub = () => {
    if (!versionInfo) return;
    const url = `https://github.com/woobottle/woobottle-labs/commit/${versionInfo.git.commitHash}`;
    window.open(url, '_blank');
  };

  if (error) {
    return (
      <Card className={`p-4 border-red-200 bg-red-50 ${className}`}>
        <div className="text-red-600 text-sm">
          ⚠️ 버전 정보를 불러올 수 없습니다: {error}
        </div>
      </Card>
    );
  }

  if (!versionInfo) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-gray-500 text-sm">
          🔄 버전 정보 로딩 중...
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 text-xs text-gray-500 ${className}`}>
        <span>v{versionInfo.version}</span>
        <span className="text-gray-300">•</span>
        <span>{versionInfo.git.shortHash}</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 hover:text-blue-700"
        >
          {isExpanded ? '접기' : '자세히'}
        </button>
        {isExpanded && (
          <div className="absolute z-10 mt-8 p-3 bg-white border rounded-lg shadow-lg text-sm">
            <div className="space-y-1">
              <div><strong>빌드:</strong> {new Date(versionInfo.buildTime).toLocaleString()}</div>
              <div><strong>브랜치:</strong> {versionInfo.git.branch}</div>
              <div><strong>환경:</strong> {versionInfo.environment}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            🚀 {versionInfo.name}
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={copyVersionInfo}
              variant="outline"
              size="sm"
            >
              📋 복사
            </Button>
            <Button
              onClick={openCommitOnGitHub}
              variant="outline"
              size="sm"
            >
              🔗 GitHub
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">버전:</span>
              <span className="font-mono font-medium">{versionInfo.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">환경:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                versionInfo.environment === 'production' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {versionInfo.environment}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">빌드 시간:</span>
              <span className="font-mono">
                {new Date(versionInfo.buildTime).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">커밋:</span>
              <span className="font-mono">{versionInfo.git.shortHash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">브랜치:</span>
              <span className="font-mono">{versionInfo.git.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">빌드 번호:</span>
              <span className="font-mono">{versionInfo.buildNumber}</span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">커밋 메시지:</span>
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                  {versionInfo.git.commitMessage}
                </div>
              </div>
              <div>
                <span className="text-gray-600">전체 커밋 해시:</span>
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
                  {versionInfo.git.commitHash}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
          >
            {isExpanded ? '간단히 보기' : '자세히 보기'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
