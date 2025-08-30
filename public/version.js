
// 자동 생성된 버전 정보 - 수정하지 마세요
window.__APP_VERSION__ = {
  "name": "woobottle-labs",
  "version": "v",
  "packageVersion": "0.1.0",
  "buildTime": "2025-08-30T14:32:29.841Z",
  "buildNumber": "local",
  "buildId": "local",
  "git": {
    "commitHash": "8a8d2aad48e0f5198521c05ba60bf0bab3db469f",
    "shortHash": "8a8d2aa",
    "branch": "main",
    "commitDate": "2025-08-30 23:30:40 +0900",
    "commitMessage": "refactor: Rearrange deployment workflow steps for clarity",
    "tag": "v"
  },
  "environment": "development",
  "ci": false,
  "debug": {
    "nodeVersion": "v18.20.5",
    "platform": "darwin",
    "arch": "arm64"
  }
};

// 전역 함수로 버전 정보 접근
window.getAppVersion = function() {
  return window.__APP_VERSION__;
};

// 콘솔에 버전 정보 출력
console.group('🚀 WooBottle Labs - Version Info');
console.log('Version:', window.__APP_VERSION__.version);
console.log('Build Time:', window.__APP_VERSION__.buildTime);
console.log('Commit:', window.__APP_VERSION__.git.shortHash);
console.log('Branch:', window.__APP_VERSION__.git.branch);
console.groupEnd();
