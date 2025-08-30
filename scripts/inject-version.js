#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 프로젝트 루트 디렉토리
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const packageJsonPath = path.join(projectRoot, 'package.json');

// package.json 읽기
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Git 정보 가져오기
function getGitInfo() {
  try {
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    const shortHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    const commitDate = execSync('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M:%S %z"', { encoding: 'utf-8' }).trim();
    const commitMessage = execSync('git log -1 --format=%s', { encoding: 'utf-8' }).trim();
    
    // 최신 태그 가져오기 (없으면 v0.0.1로 기본값)
    let tag = 'v0.0.1';
    try {
      tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
    } catch (e) {
      console.log('⚠️  No git tags found, using default version v0.0.1');
    }

    return {
      commitHash,
      shortHash,
      branch,
      commitDate,
      commitMessage,
      tag
    };
  } catch (error) {
    console.log('⚠️  Git 정보를 가져올 수 없습니다. 기본값을 사용합니다.');
    return {
      commitHash: 'unknown',
      shortHash: 'unknown',
      branch: 'unknown',
      commitDate: new Date().toISOString(),
      commitMessage: 'unknown',
      tag: 'v0.0.1'
    };
  }
}

// 환경 변수 확인
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const buildNumber = process.env.GITHUB_RUN_NUMBER || process.env.BUILD_NUMBER || 'local';
const buildId = process.env.GITHUB_RUN_ID || process.env.BUILD_ID || 'local';
const environment = process.env.NODE_ENV || 'development';

// 버전 정보 생성
const gitInfo = getGitInfo();
const versionInfo = {
  name: packageJson.name,
  version: gitInfo.tag,
  packageVersion: packageJson.version,
  buildTime: new Date().toISOString(),
  buildNumber,
  buildId,
  git: gitInfo,
  environment,
  ci: isCI,
  debug: {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch
  }
};

// public 디렉토리가 없으면 생성
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// version.json 파일 생성
const versionJsonPath = path.join(publicDir, 'version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2));

// version.js 파일 생성 (브라우저에서 사용)
const versionJsContent = `
// 자동 생성된 버전 정보 - 수정하지 마세요
window.__APP_VERSION__ = ${JSON.stringify(versionInfo, null, 2)};

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
`;

const versionJsPath = path.join(publicDir, 'version.js');
fs.writeFileSync(versionJsPath, versionJsContent);

console.log('✅ 버전 정보가 생성되었습니다:');
console.log(`   - ${versionJsonPath}`);
console.log(`   - ${versionJsPath}`);
console.log(`   - Version: ${versionInfo.version}`);
console.log(`   - Build Time: ${versionInfo.buildTime}`);
console.log(`   - Commit: ${versionInfo.git.shortHash}`);
console.log(`   - Environment: ${versionInfo.environment}`);
