# 🐛 SPA 버전 관리 및 디버깅 가이드

## 📋 개요

SPA 특성상 버전을 알 수 없어 디버깅에 어려움이 있던 문제를 해결하기 위해 종합적인 버전 관리 및 디버깅 시스템을 구축했습니다.

## 🎯 주요 기능

### 1. **런타임 버전 확인**
- 브라우저에서 현재 버전 실시간 확인
- 빌드 정보, Git 커밋, 환경 정보 포함
- 개발자 도구에서 쉽게 접근 가능

### 2. **디버깅 도구**
- 브라우저 콘솔에서 사용할 수 있는 디버그 명령어
- 버전 비교, 캐시 클리어, 롤백 정보 제공
- 클립보드 복사로 쉬운 정보 공유

### 3. **버전 비교 및 분석**
- 현재 배포된 버전과 사용 가능한 버전 비교
- 롤백 시뮬레이션 기능
- 상세한 버전 정보 조회

## 🚀 사용 방법

### 브라우저에서 버전 확인

#### 1. **콘솔에서 확인**
```javascript
// 현재 버전 정보 출력
__debug.version()

// 전체 버전 정보 객체 반환
__debug.versionInfo()

// 서버의 최신 버전과 비교
await __debug.checkVersion()
```

#### 2. **전역 변수로 접근**
```javascript
// 버전 정보 객체
window.__APP_VERSION__

// 편의 함수
window.getAppVersion()
```

#### 3. **설정 페이지에서 확인**
- `/settings` 페이지 하단의 "버전 정보" 섹션
- 상세 정보 보기, GitHub 링크, 클립보드 복사 기능

### 디버깅 도구 사용법

#### **기본 명령어**
```javascript
// 🔍 현재 버전 정보
__debug.version()

// 📋 디버깅 정보 클립보드 복사
__debug.copyVersion()

// 🔄 서버 버전 확인
await __debug.checkVersion()

// 📊 배포 정보 확인
await __debug.compareVersions()

// 🔄 롤백 정보 및 방법 안내
__debug.rollbackInfo()

// 🧹 캐시 클리어
__debug.clearCache()

// 🐛 디버그 모드 토글
__debug.debugMode(true)  // 활성화
__debug.debugMode(false) // 비활성화
```

#### **디버깅 정보 예시**
```
WooBottle Labs - 디버깅 정보
==========================
버전: v1.0.2
빌드 시간: 2025-08-30T08:40:04.617Z
커밋: eaa468f313dcc2596a2aa03e49b568ff93bca5c2
브랜치: main
환경: production
빌드 번호: 123
커밋 메시지: Add new feature
URL: https://woo-bottle.com/
User Agent: Mozilla/5.0...
```

### 명령줄 도구 사용법

#### **버전 비교 및 분석**
```bash
# 현재 버전과 사용 가능한 버전들 비교
npm run version:compare

# 특정 버전의 상세 정보 조회
npm run version:details v1.0.1

# 롤백 시뮬레이션
npm run version:simulate v1.0.0

# 현재 배포된 버전 정보만 표시
./scripts/version-compare.sh current
```

#### **기존 버전 관리 명령어**
```bash
# 버전 생성 및 배포
npm run deploy:patch          # 패치 버전 생성 후 배포
npm run deploy:minor          # 마이너 버전 생성 후 배포
npm run deploy:major          # 메이저 버전 생성 후 배포

# 롤백
npm run rollback              # 대화형 롤백

# 버전 조회
npm run versions              # Git 태그 목록
npm run versions:s3:prod      # S3 버전 목록
npm run version:current       # 현재 버전
```

## 🔧 빌드 시 버전 주입

### 자동 실행
```bash
# prebuild 스크립트로 자동 실행됨
npm run build
```

### 수동 실행
```bash
# 버전 정보만 생성
node scripts/inject-version.js
```

### 생성되는 파일들
- `public/version.json` - API 엔드포인트용
- `public/version.js` - 브라우저 전역 변수
- `src/version.d.ts` - TypeScript 타입 정의

## 🐛 디버깅 시나리오

### 1. **사용자 버그 신고 시**
```javascript
// 사용자에게 요청: 콘솔에서 실행 후 결과 복사
__debug.copyVersion()
```

### 2. **배포 후 버전 확인**
```javascript
// 최신 버전이 배포되었는지 확인
await __debug.checkVersion()
```

### 3. **캐시 문제 해결**
```javascript
// 캐시 클리어 후 새로고침
__debug.clearCache()
```

### 4. **롤백 필요 시**
```bash
# 1. 사용 가능한 버전 확인
npm run version:compare

# 2. 롤백 시뮬레이션
npm run version:simulate v1.0.0

# 3. 실제 롤백 실행
npm run rollback
```

## 📊 버전 정보 구조

```typescript
interface AppVersionInfo {
  // 기본 정보
  name: string;                    // 앱 이름
  version: string;                 // Git 태그 버전
  packageVersion: string;          // package.json 버전
  description: string;             // 앱 설명
  
  // 빌드 정보
  buildTime: string;               // 빌드 시간 (ISO)
  buildNumber: string;             // CI 빌드 번호
  buildId: string;                 // CI 빌드 ID
  
  // Git 정보
  git: {
    commitHash: string;            // 전체 커밋 해시
    shortHash: string;             // 짧은 커밋 해시
    branch: string;                // 브랜치명
    commitDate: string;            // 커밋 날짜
    commitMessage: string;         // 커밋 메시지
    tag: string;                   // Git 태그
  };
  
  // 환경 정보
  environment: string;             // development/production
  ci: boolean;                     // CI 환경 여부
  
  // 디버깅 정보
  debug: {
    nodeVersion: string;           // Node.js 버전
    platform: string;             // OS 플랫폼
    arch: string;                  // CPU 아키텍처
  };
}
```

## 🚨 긴급 상황 대응

### **긴급 롤백 (AWS CLI 직접 사용)**
```bash
# 1. 사용 가능한 버전 확인
aws s3 ls s3://woo-bottle.com/versions/

# 2. 즉시 롤백
aws s3 sync s3://woo-bottle.com/versions/v1.0.0/ s3://woo-bottle.com/current/ --delete

# 3. CloudFront 캐시 무효화 (필요시)
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```

### **버전 정보 확인 (서버 접근 불가 시)**
```bash
# S3에서 직접 배포 정보 확인
aws s3 cp s3://woo-bottle.com/current/deploy-info.json -
```

## 💡 팁 및 모범 사례

### **개발 시**
1. 개발 환경에서는 자동으로 버전 정보가 콘솔에 출력됩니다
2. `__debug` 객체를 활용하여 실시간 디버깅
3. 버전 변경 시 `npm run version:compare`로 확인

### **배포 시**
1. 배포 전 `npm run version:compare`로 상태 확인
2. 배포 후 브라우저에서 `__debug.checkVersion()` 실행
3. 문제 발생 시 `npm run version:simulate`로 롤백 계획 수립

### **사용자 지원 시**
1. 사용자에게 `__debug.copyVersion()` 실행 요청
2. 복사된 정보로 정확한 버전 및 환경 파악
3. 필요시 특정 버전으로 롤백 안내

## 🔗 관련 파일

- `scripts/inject-version.js` - 버전 정보 주입 스크립트
- `scripts/version-compare.sh` - 버전 비교 및 분석 도구
- `src/shared/ui/version-info/` - 버전 정보 UI 컴포넌트
- `src/shared/lib/debug-tools.ts` - 브라우저 디버깅 도구
- `public/version.json` - 버전 정보 API 엔드포인트
- `public/version.js` - 브라우저 전역 변수

이제 SPA에서도 명확한 버전 관리와 효율적인 디버깅이 가능합니다! 🎉
