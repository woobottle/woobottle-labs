
// 자동 생성된 버전 정보 타입 정의
export interface AppVersionInfo {
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

declare global {
  interface Window {
    __APP_VERSION__: AppVersionInfo;
    getAppVersion(): AppVersionInfo;
  }
}

export {};
