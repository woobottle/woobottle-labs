
// 자동 생성된 버전 정보 - 수정하지 마세요
window.__APP_VERSION__ = {
  "name": "woobottle-labs",
  "version": "v0.0.2",
  "packageVersion": "0.1.0",
  "buildTime": "2025-08-30T08:40:04.617Z",
  "buildNumber": "local",
  "buildId": "local",
  "git": {
    "commitHash": "eaa468f313dcc2596a2aa03e49b568ff93bca5c2",
    "shortHash": "eaa468f3",
    "branch": "main",
    "commitDate": "2025-08-30 17:31:16 +0900",
    "commitMessage": "refactor: Remove staging environment support from deployment scripts and workflows",
    "tag": "v0.0.2"
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
