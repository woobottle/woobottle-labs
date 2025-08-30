#!/usr/bin/env node

/**
 * 빌드 시 버전 정보를 주입하는 스크립트
 * package.json과 Git 정보를 기반으로 버전 정보 생성
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 색상 정의
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getGitInfo() {
  try {
    const commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const shortHash = commitHash.substring(0, 8);
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const commitDate = execSync('git log -1 --format=%ci', { encoding: 'utf8' }).trim();
    const commitMessage = execSync('git log -1 --format=%s', { encoding: 'utf8' }).trim();
    
    // 태그 정보 (최신 태그)
    let tag = '';
    try {
      tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    } catch (e) {
      tag = 'v0.0.0'; // 태그가 없으면 기본값
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
    log('⚠️  Git 정보를 가져올 수 없습니다. 기본값을 사용합니다.', 'yellow');
    return {
      commitHash: 'unknown',
      shortHash: 'unknown',
      branch: 'unknown',
      commitDate: new Date().toISOString(),
      commitMessage: 'unknown',
      tag: 'v0.0.0'
    };
  }
}

function getPackageInfo() {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description
    };
  } catch (error) {
    log('❌ package.json을 읽을 수 없습니다.', 'red');
    process.exit(1);
  }
}

function generateVersionInfo() {
  const buildTime = new Date().toISOString();
  const gitInfo = getGitInfo();
  const packageInfo = getPackageInfo();
  
  return {
    // 기본 정보
    name: packageInfo.name,
    version: gitInfo.tag, // Git 태그를 버전으로 사용
    packageVersion: packageInfo.version,
    description: packageInfo.description,
    
    // 빌드 정보
    buildTime,
    buildNumber: process.env.GITHUB_RUN_NUMBER || 'local',
    buildId: process.env.GITHUB_RUN_ID || 'local',
    
    // Git 정보
    git: {
      commitHash: gitInfo.commitHash,
      shortHash: gitInfo.shortHash,
      branch: gitInfo.branch,
      commitDate: gitInfo.commitDate,
      commitMessage: gitInfo.commitMessage,
      tag: gitInfo.tag
    },
    
    // 환경 정보
    environment: process.env.NODE_ENV || 'development',
    ci: process.env.CI === 'true',
    
    // 디버깅용 추가 정보
    debug: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };
}

function createVersionFiles(versionInfo) {
  const outputDir = path.join(process.cwd(), 'public');
  
  // public 디렉토리가 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 1. JSON 파일로 저장 (API 엔드포인트용)
  const versionJsonPath = path.join(outputDir, 'version.json');
  fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2));
  log(`✅ 버전 정보 JSON 생성: ${versionJsonPath}`, 'green');
  
  // 2. JavaScript 파일로 저장 (런타임 접근용)
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
  
  const versionJsPath = path.join(outputDir, 'version.js');
  fs.writeFileSync(versionJsPath, versionJsContent);
  log(`✅ 버전 정보 JS 생성: ${versionJsPath}`, 'green');
  
  // 3. TypeScript 타입 정의 생성
  const versionTypesContent = `
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
`;
  
  const srcDir = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcDir)) {
    const versionTypesPath = path.join(srcDir, 'version.d.ts');
    fs.writeFileSync(versionTypesPath, versionTypesContent);
    log(`✅ 버전 정보 타입 정의 생성: ${versionTypesPath}`, 'green');
  }
}

function main() {
  log('🔧 버전 정보 주입 시작...', 'blue');
  
  const versionInfo = generateVersionInfo();
  
  log('📋 생성된 버전 정보:', 'bright');
  console.log(`   이름: ${versionInfo.name}`);
  console.log(`   버전: ${versionInfo.version}`);
  console.log(`   빌드 시간: ${versionInfo.buildTime}`);
  console.log(`   커밋: ${versionInfo.git.shortHash} (${versionInfo.git.branch})`);
  console.log(`   환경: ${versionInfo.environment}`);
  
  createVersionFiles(versionInfo);
  
  log('🎉 버전 정보 주입 완료!', 'green');
}

// 스크립트가 직접 실행될 때만 main 함수 실행
if (require.main === module) {
  main();
}

module.exports = { generateVersionInfo, createVersionFiles };
