# 배포 및 롤백 아키텍처

## 목차
1. [개요](#개요)
2. [전체 구조](#전체-구조)
3. [배포 플로우](#배포-플로우)
4. [롤백 플로우](#롤백-플로우)
5. [사용자 경험 시나리오](#사용자-경험-시나리오)
6. [PWA 대응](#pwa-대응)
7. [CloudFront 설정](#cloudfront-설정)
8. [마이그레이션 가이드](#마이그레이션-가이드)
9. [트러블슈팅](#트러블슈팅)

---

## 개요

### 목표
- **빠른 롤백**: 문제 발생 시 1분 내 이전 버전으로 복구
- **청크 에러 없음**: 배포/롤백 중에도 사용자 경험 유지
- **PWA 호환**: Progressive Web App 지원

### 핵심 아이디어
```
기존 방식:
  모든 파일을 루트에 배포 → 롤백 시 파일별로 복원 (느림)

새로운 방식:
  버전별 폴더에 배포 → 롤백 시 경로만 전환 (빠름)
```

---

## 전체 구조

### S3 버킷 구조

```
s3://woo-bottle.com/
│
├── releases-metadata.json          ← 릴리스 목록 관리
│
├── sw.js                           ← Service Worker (PWA)
├── manifest.json                   ← PWA 매니페스트
├── icons/                          ← 앱 아이콘
│
└── releases/
    ├── deploy-20250115-100000-abc1234/    ← 버전 1
    │   ├── index.html
    │   ├── about/
    │   │   └── index.html
    │   ├── timer/
    │   │   └── index.html
    │   └── _next/
    │       └── static/
    │           └── chunks/
    │               ├── main-xxxxx.js
    │               └── app/
    │                   ├── page-xxxxx.js
    │                   └── timer/
    │                       └── page-xxxxx.js
    │
    ├── deploy-20250116-120000-def5678/    ← 버전 2
    │   └── (동일 구조)
    │
    └── deploy-20250117-090000-ghi9012/    ← 버전 3 (현재)
        └── (동일 구조)
```

### CloudFront 구조

**중요**: CloudFront에서 Origin Path는 **Origin 레벨**에서 설정됩니다. 따라서 다른 Origin Path가 필요한 경우 **2개의 Origin**이 필요합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CloudFront Distribution                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Origins:                                                        │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │ S3-versioned │ Origin Path: /releases/deploy-xxx        │  │
│    ├─────────────────────────────────────────────────────────┤  │
│    │ S3-root      │ Origin Path: (없음)                      │  │
│    └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Behaviors (우선순위 순):                                         │
│                                                                  │
│  1. /sw.js           → Origin: S3-root                          │
│  2. /manifest.json   → Origin: S3-root                          │
│  3. /icons/*         → Origin: S3-root                          │
│  4. /releases/*      → Origin: S3-root      ← 핵심! 이전 버전 접근│
│  5. Default (*)      → Origin: S3-versioned ← 새 사용자 라우팅   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         S3 Bucket                                │
│                      woo-bottle.com                              │
└─────────────────────────────────────────────────────────────────┘
```

### 왜 2개의 Origin이 필요한가?

```
❌ Origin 1개만 사용하면 (Origin Path: /releases/deploy-xxx):

   요청: /releases/deploy-v2/_next/static/chunk.js
   ↓
   Origin Path + 요청 경로 = 중복!
   ↓
   S3: /releases/deploy-xxx/releases/deploy-v2/_next/... → 404

✅ Origin 2개 사용:

   요청: /releases/deploy-v2/_next/static/chunk.js
   ↓
   /releases/* Behavior → S3-root (Origin Path 없음)
   ↓
   S3: /releases/deploy-v2/_next/static/chunk.js → 200 ✓
```

---

## 배포 플로우

### 단계별 설명

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. 빌드                                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DEPLOYMENT_TAG=deploy-20250117-090000-ghi9012                  │
│                                                                  │
│  next.config.ts:                                                 │
│    assetPrefix: /releases/deploy-20250117-090000-ghi9012        │
│    basePath: /releases/deploy-20250117-090000-ghi9012           │
│                                                                  │
│  결과: HTML 내 모든 에셋 경로에 버전 포함                          │
│    <script src="/releases/deploy-xxx/_next/static/chunks/...">  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. S3 업로드                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  aws s3 sync ./out/ s3://bucket/releases/deploy-xxx/            │
│                                                                  │
│  → 새 버전이 별도 폴더에 업로드                                    │
│  → 기존 버전은 그대로 유지                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. 메타데이터 업데이트                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  releases-metadata.json:                                         │
│  {                                                               │
│    "current": "deploy-20250117-090000-ghi9012",                 │
│    "releases": [                                                 │
│      { "tag": "deploy-20250117-090000-ghi9012", ... },  ← 최신  │
│      { "tag": "deploy-20250116-120000-def5678", ... },          │
│      { "tag": "deploy-20250115-100000-abc1234", ... }           │
│    ]                                                             │
│  }                                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. CloudFront Origin Path 변경                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  S3-versioned Origin의 Origin Path 업데이트:                     │
│    이전: /releases/deploy-20250116-120000-def5678               │
│    변경: /releases/deploy-20250117-090000-ghi9012               │
│                                                                  │
│  ⚠️ 중요: Origin ID로 찾아서 업데이트 (배열 인덱스 X)              │
│    - Default Behavior의 TargetOriginId 확인                      │
│    - 해당 Origin만 Origin Path 변경                              │
│    - S3-root Origin은 건드리지 않음                               │
│                                                                  │
│  → 새 사용자는 새 버전으로 라우팅                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. 캐시 무효화                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  aws cloudfront create-invalidation --paths "/*"                │
│                                                                  │
│  → 엣지 캐시 제거 → 새 버전 서빙 시작                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. 오래된 릴리스 정리                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  최근 5개 버전만 유지                                             │
│  6번째부터 S3에서 삭제                                            │
│                                                                  │
│  → 스토리지 비용 관리                                             │
│  → 5단계 롤백 가능                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 롤백 플로우

### 단계별 설명

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. 롤백 대상 결정                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  옵션 A: rollback_steps=1 (1단계 이전)                           │
│  옵션 B: target_release=deploy-xxx (특정 버전)                   │
│                                                                  │
│  releases-metadata.json에서 대상 버전 확인                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. CloudFront Origin Path 변경                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Default Behavior의 Origin Path:                                 │
│    현재: /releases/deploy-20250117-090000-ghi9012 (v3)          │
│    변경: /releases/deploy-20250116-120000-def5678 (v2)          │
│                                                                  │
│  ⏱️ 소요 시간: ~10초                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. 메타데이터 업데이트                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  current: "deploy-20250116-120000-def5678"                      │
│                                                                  │
│  (releases 배열은 유지 - 다시 롤포워드 가능)                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. 캐시 무효화                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  aws cloudfront create-invalidation --paths "/*"                │
│                                                                  │
│  ⏱️ 전파 시간: 30초 ~ 2분                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. 완료                                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  총 롤백 시간: ~1분                                               │
│                                                                  │
│  (기존 S3 Batch Operations 방식: 5~15분)                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 사용자 경험 시나리오

### 시나리오 1: 새 배포 중 기존 사용자

```
상황: 사용자가 v2를 사용 중, v3 배포 발생

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   사용자 브라우저  │     │    CloudFront    │     │       S3         │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │  v2 HTML 이미 로드됨    │                        │
         │  (청크 경로: /releases/deploy-v2/_next/...)     │
         │                        │                        │
         │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ v3 배포 발생 ─ ─ ─ ─ ─ │
         │                        │                        │
         │  페이지 이동 (timer 클릭)                        │
         │                        │                        │
         │  GET /releases/deploy-v2/_next/.../timer.js     │
         │───────────────────────>│                        │
         │                        │                        │
         │                        │  /releases/* 매칭      │
         │                        │  Origin Path 없음      │
         │                        │                        │
         │                        │  GET /releases/deploy-v2/...
         │                        │───────────────────────>│
         │                        │                        │
         │                        │        v2 청크 반환    │
         │                        │<───────────────────────│
         │                        │                        │
         │        v2 청크 로드 성공 ✓                       │
         │<───────────────────────│                        │
         │                        │                        │
         │  사용자는 v2 계속 사용 (새로고침 전까지)          │
         │                        │                        │

핵심: /releases/* Behavior가 Origin Path 없이 S3 직접 접근
     → 이전 버전 청크도 로드 가능
     → 청크 에러 없음!
```

### 시나리오 2: 새 사용자 접속

```
상황: v3 배포 후 새 사용자 접속

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   사용자 브라우저  │     │    CloudFront    │     │       S3         │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │  GET /                 │                        │
         │───────────────────────>│                        │
         │                        │                        │
         │                        │  Default (*) 매칭      │
         │                        │  Origin Path: /releases/deploy-v3
         │                        │                        │
         │                        │  GET /releases/deploy-v3/index.html
         │                        │───────────────────────>│
         │                        │                        │
         │                        │     v3 HTML 반환       │
         │                        │<───────────────────────│
         │                        │                        │
         │      v3 HTML 수신      │                        │
         │<───────────────────────│                        │
         │                        │                        │
         │  HTML 파싱 → 청크 로드  │                        │
         │  경로: /releases/deploy-v3/_next/...            │
         │                        │                        │
         │  GET /releases/deploy-v3/_next/.../main.js      │
         │───────────────────────>│                        │
         │                        │                        │
         │  (동일 과정으로 v3 청크 로드)                     │
         │                        │                        │

핵심: Default Behavior의 Origin Path가 현재 버전으로 설정
     → 새 사용자는 항상 최신 버전 로드
```

### 시나리오 3: 롤백 중 기존 사용자

```
상황: v3에서 v2로 롤백, 사용자가 v3 사용 중

┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   사용자 브라우저  │     │    CloudFront    │     │       S3         │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │  v3 HTML 이미 로드됨    │                        │
         │                        │                        │
         │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 롤백 발생 (v3→v2) ─ ─ ─ │
         │                        │                        │
         │  Origin Path 변경:     │                        │
         │  /releases/deploy-v3 → /releases/deploy-v2      │
         │                        │                        │
         │  페이지 이동            │                        │
         │                        │                        │
         │  GET /releases/deploy-v3/_next/.../about.js     │
         │───────────────────────>│                        │
         │                        │                        │
         │                        │  /releases/* 매칭      │
         │                        │  → S3 직접 접근        │
         │                        │                        │
         │                        │  GET /releases/deploy-v3/...
         │                        │───────────────────────>│
         │                        │                        │
         │                        │     v3 청크 반환 ✓     │
         │                        │<───────────────────────│
         │                        │                        │
         │       정상 동작!        │                        │
         │<───────────────────────│                        │
         │                        │                        │
         │  새로고침하면 v2 로드   │                        │
         │                        │                        │

핵심: 롤백해도 v3 파일은 S3에 그대로 존재
     → 기존 사용자는 v3 청크 계속 접근 가능
     → 새로고침 시 v2로 자연스럽게 전환
```

---

## PWA 대응

### 왜 PWA 에셋은 루트에 배치해야 하는가?

PWA 에셋(`sw.js`, `manifest.json`, `icons/`)을 release 폴더에 포함하면 **chunk 파일 문제**가 발생합니다:

```
❌ PWA 에셋이 release 폴더에 있으면:

1. 사용자가 v2에서 sw.js 등록
2. sw.js가 /_next/static/... 경로를 precache (루트 기준)
3. 새 배포 (v3) → CloudFront Origin Path 변경
4. 구 sw.js가 캐시한 chunk 파일 경로와 실제 경로 불일치
5. 404 에러 또는 잘못된 버전 로드

✅ PWA 에셋이 루트에 있으면:

1. sw.js는 항상 최신 버전 (루트에서 제공)
2. /releases/* 요청은 캐시 안 함 → 항상 네트워크에서 로드
3. 버전 전환 시에도 올바른 chunk 로드
```

### 파일 배치

```
S3:
├── sw.js              ← 루트 (버전과 무관, 항상 최신)
├── manifest.json      ← 루트 (버전과 무관)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── releases/
    └── (버전별 앱 코드)
```

### manifest.json

```json
{
  "name": "WooBottle Labs",
  "short_name": "WooBottle",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**핵심**: `start_url: "/"` → CloudFront가 현재 버전으로 라우팅

### Service Worker (sw.js)

```javascript
const STATIC_CACHE = 'static-v1';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 설치: 정적 리소스만 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 활성화: 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter((name) => name !== STATIC_CACHE)
             .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 요청 처리
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // /releases/* 경로: 항상 네트워크 (캐시 안 함)
  // → 버전 전환 시 항상 최신/올바른 버전 로드
  if (url.pathname.startsWith('/releases/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 정적 리소스: 캐시 우선
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // 그 외: 네트워크 우선
  event.respondWith(fetch(event.request));
});
```

**핵심 전략**:
- `/releases/*` → **절대 캐시 안 함** (버전 전환 보장)
- 정적 리소스 (아이콘 등) → 캐시
- 나머지 → 네트워크 우선

### PWA 동작 흐름

```
1. 사용자가 PWA 설치 (v2 기준)
   └── manifest.json의 start_url: "/" 저장

2. 앱 아이콘 클릭
   └── "/" 요청

3. CloudFront Default Behavior
   └── Origin Path: /releases/deploy-v3 (현재 버전)
   └── v3 앱 로드

4. SW가 /releases/* 요청 처리
   └── 캐시 안 함 → 네트워크에서 로드
   └── 항상 올바른 버전 로드!
```

---

## CloudFront 설정

### 중요: Origin Path는 Origin 레벨에서 설정됨

CloudFront에서 **Origin Path는 Behavior가 아닌 Origin에 설정**됩니다. 따라서 다른 Origin Path가 필요한 경우 **별도의 Origin을 생성**해야 합니다.

```
❌ 잘못된 이해:
   Behavior마다 다른 Origin Path 설정 가능

✅ 올바른 이해:
   Origin에 Origin Path 설정 → 해당 Origin을 사용하는 모든 Behavior에 적용
   → 다른 Origin Path가 필요하면 별도 Origin 필요
```

### 필요한 Origins

| Origin ID | S3 Bucket | Origin Path | 용도 |
|-----------|-----------|-------------|------|
| `S3-versioned` | woo-bottle.com | `/releases/deploy-xxx` | 현재 버전 (Default) |
| `S3-root` | woo-bottle.com | (없음) | releases/*, PWA |

### 필요한 Behaviors

| 우선순위 | Path Pattern | Origin | 결과 S3 경로 |
|---------|--------------|--------|-------------|
| 0 | `/sw.js` | S3-root | `s3://bucket/sw.js` |
| 1 | `/manifest.json` | S3-root | `s3://bucket/manifest.json` |
| 2 | `/icons/*` | S3-root | `s3://bucket/icons/*` |
| 3 | `/releases/*` | S3-root | `s3://bucket/releases/*` |
| 4 | `Default (*)` | S3-versioned | `s3://bucket/releases/deploy-xxx/*` |

### 설정 방법

#### 옵션 A: 스크립트 사용 (권장)

```bash
./scripts/setup-cloudfront-behaviors.sh <DISTRIBUTION_ID>
```

#### 옵션 B: AWS 콘솔에서 수동 설정

```
1. CloudFront Console → Distribution 선택

2. Origins 탭 → Create Origin
   - Origin domain: woo-bottle.com.s3.ap-northeast-2.amazonaws.com
   - Origin path: (비워두기)
   - Name: S3-woo-bottle-root
   - Origin access: 기존 Origin과 동일하게 설정 (OAC 또는 OAI)

3. Behaviors 탭 → Create Behavior (4번 반복)

   Behavior 1:
   - Path Pattern: /sw.js
   - Origin: S3-woo-bottle-root (새로 만든 Origin)

   Behavior 2:
   - Path Pattern: /manifest.json
   - Origin: S3-woo-bottle-root

   Behavior 3:
   - Path Pattern: /icons/*
   - Origin: S3-woo-bottle-root

   Behavior 4:
   - Path Pattern: /releases/*
   - Origin: S3-woo-bottle-root

4. Default Behavior
   - Origin: 기존 S3 Origin (S3-versioned)
   - deploy.yml이 배포 시 이 Origin의 Origin Path를 자동 업데이트
```

### 경로 흐름 예시

```
1. 새 사용자가 / 접속
   GET /
   → Default Behavior → S3-versioned (Origin Path: /releases/deploy-v3)
   → S3: /releases/deploy-v3/index.html ✓

2. HTML에서 청크 로드 (assetPrefix로 경로 포함)
   GET /releases/deploy-v3/_next/static/chunks/main.js
   → /releases/* Behavior → S3-root (Origin Path: 없음)
   → S3: /releases/deploy-v3/_next/static/chunks/main.js ✓

3. 새 배포 후 (v4) 기존 사용자가 v3 청크 요청
   GET /releases/deploy-v3/_next/static/chunks/page.js
   → /releases/* Behavior → S3-root
   → S3: /releases/deploy-v3/_next/static/chunks/page.js ✓
   (v3 파일이 아직 S3에 존재하므로 정상 로드)

4. PWA manifest 요청
   GET /manifest.json
   → /manifest.json Behavior → S3-root
   → S3: /manifest.json ✓
```

### 필요한 IAM 권한

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::woo-bottle.com",
        "arn:aws:s3:::woo-bottle.com/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:GetDistributionConfig",
        "cloudfront:UpdateDistribution",
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

---

## 요약

### 핵심 포인트

1. **버전별 경로 분리**: `/releases/deploy-xxx/`
2. **assetPrefix**: 청크 경로에 버전 포함
3. **Behavior 라우팅**: 이전 버전 청크 접근 가능
4. **Origin Path 전환**: 빠른 버전 전환
5. **PWA**: 루트에 고정, `/releases/*`는 캐시 제외

### 성능 비교

| 항목 | 기존 방식 | 새 방식 |
|------|----------|--------|
| 롤백 시간 | 5~15분 | ~1분 |
| 청크 에러 | 발생 가능 | 없음 |
| 스토리지 | 단일 버전 | 5개 버전 |
| 복잡도 | 낮음 | 중간 |
| PWA 호환 | 완벽 | 설정 필요 |

---

## 마이그레이션 가이드

기존에 S3 루트에 직접 배포하던 프로젝트에서 이 아키텍처로 마이그레이션하는 방법입니다.

### 기존 상태 확인

```
기존 구조:
┌─────────────────────────────────────────┐
│ Origin: S3 (Origin Path: 없음)          │
│ Behavior: Default (*) → 이 Origin       │
└─────────────────────────────────────────┘

S3:
├── index.html
├── _next/static/...
└── (모든 파일이 루트에)
```

### 단계 1: CloudFront 설정 변경

#### A. 새 Origin 추가 (S3-versioned)

CloudFront Console → Distribution → Origins 탭 → Create Origin

```
- Origin domain: 기존과 동일한 S3 버킷
- Origin path: /releases/deploy-xxx (첫 배포 태그)
- Name: S3-woo-bottle-versioned
- Origin access: 기존 Origin과 동일 (OAC 또는 OAI)
```

#### B. Behaviors 추가

기존 Origin (S3-root)을 사용하는 Behavior 추가:

| Path Pattern | Origin | 설명 |
|--------------|--------|------|
| `/releases/*` | 기존 S3 Origin | 버전별 chunk 접근 |
| `/sw.js` | 기존 S3 Origin | PWA |
| `/manifest.json` | 기존 S3 Origin | PWA |
| `/icons/*` | 기존 S3 Origin | PWA |

#### C. Default Behavior 변경

Default Behavior의 Origin을 **S3-versioned** (새로 만든 것)로 변경

### 단계 2: 코드 설정

#### next.config.ts

```typescript
const deploymentTag = process.env.DEPLOYMENT_TAG || "";
const assetPrefix = deploymentTag ? `/releases/${deploymentTag}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  assetPrefix: assetPrefix,
  basePath: assetPrefix,
  // ...
};
```

#### deploy.yml, rollback.yml

Origin ID로 찾아서 Origin Path 업데이트하도록 설정 (Items[0] 사용 금지)

```yaml
DEFAULT_ORIGIN_ID=$(jq -r '.DistributionConfig.DefaultCacheBehavior.TargetOriginId' /tmp/cf-config.json)

jq --arg path "$NEW_ORIGIN_PATH" \
   --arg originId "$DEFAULT_ORIGIN_ID" \
   '.DistributionConfig.Origins.Items = [
      .DistributionConfig.Origins.Items[] |
      if .Id == $originId then .OriginPath = $path else . end
    ]' \
   /tmp/cf-config.json
```

### 단계 3: 첫 배포 실행

```bash
# GitHub Actions에서 deploy workflow 실행
# → S3에 /releases/deploy-xxx/ 폴더 생성
# → CloudFront Origin Path 업데이트
```

### 단계 4: 최종 구조 확인

```
CloudFront:
┌─────────────────────────────────────────────┐
│ S3-versioned │ Origin Path: /releases/xxx   │ ← 새로 추가
│ S3-root      │ Origin Path: (없음)          │ ← 기존 Origin
└─────────────────────────────────────────────┘

S3:
├── sw.js                    ← 루트 (PWA)
├── manifest.json            ← 루트 (PWA)
├── icons/                   ← 루트 (PWA)
├── index.html               ← 기존 파일 (나중에 삭제)
├── _next/                   ← 기존 파일 (나중에 삭제)
└── releases/
    └── deploy-xxx/          ← 새 버전
        ├── index.html
        └── _next/static/...
```

### 단계 5: 기존 파일 정리 (선택)

마이그레이션 후 안정화되면 S3 루트의 기존 파일 삭제:

```bash
# ⚠️ 주의: releases/, sw.js, manifest.json, icons/는 유지!

aws s3 rm s3://bucket/index.html
aws s3 rm s3://bucket/_next/ --recursive
aws s3 rm s3://bucket/about/ --recursive
aws s3 rm s3://bucket/timer/ --recursive
# ... 기타 페이지 폴더
```

### 마이그레이션 체크리스트

- [ ] CloudFront에 S3-versioned Origin 추가 (Origin Path: /releases/첫태그)
- [ ] `/releases/*`, `/sw.js`, `/manifest.json`, `/icons/*` Behaviors 추가 → 기존 Origin
- [ ] Default Behavior → S3-versioned로 변경
- [ ] next.config.ts에 assetPrefix/basePath 설정
- [ ] deploy.yml에 Origin ID 기반 업데이트 로직 적용
- [ ] rollback.yml에 Origin ID 기반 업데이트 로직 적용
- [ ] 첫 배포 실행 및 테스트
- [ ] 안정화 후 기존 루트 파일 정리

---

## 트러블슈팅

### 404 에러: chunk 파일을 찾을 수 없음

**증상:**
```
GET https://woo-bottle.com/releases/deploy-xxx/_next/static/chunks/xxx.js 404
```

**원인 1: `/releases/*` Behavior가 없음**
- 모든 요청이 Default Behavior로 처리됨
- Default Behavior의 Origin Path가 추가되어 경로 중복

**해결:**
```bash
./scripts/setup-cloudfront-behaviors.sh <DISTRIBUTION_ID>
```

또는 AWS 콘솔에서 `/releases/*` Behavior 추가 (S3-root Origin 사용)

---

**원인 2: S3-root Origin이 없음**
- `/releases/*` Behavior가 있지만 Origin Path가 있는 Origin을 사용

**해결:**
Origin Path가 비어있는 새 Origin (S3-root) 생성 후 Behavior에서 사용

---

**원인 3: deploy.yml에서 잘못된 Origin 업데이트**
- `Items[0]`으로 Origin을 찾아서 S3-root Origin이 업데이트됨

**해결:**
Origin ID로 찾아서 업데이트 (deploy.yml, rollback.yml 확인)

```yaml
# ❌ 잘못된 방식
jq '.DistributionConfig.Origins.Items[0].OriginPath = $path'

# ✅ 올바른 방식
DEFAULT_ORIGIN_ID=$(jq -r '.DistributionConfig.DefaultCacheBehavior.TargetOriginId' ...)
jq 'if .Id == $originId then .OriginPath = $path else . end'
```

---

### PWA가 이전 버전을 계속 로드함

**원인:** Service Worker가 chunk 파일을 캐시함

**해결:** sw.js에서 `/releases/*` 경로는 캐시하지 않도록 설정

```javascript
if (url.pathname.startsWith('/releases/')) {
  event.respondWith(fetch(event.request));
  return;
}
```

---

### 배포 후에도 이전 버전이 보임

**원인 1:** CloudFront 캐시가 무효화되지 않음

**해결:**
```bash
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

**원인 2:** 브라우저 캐시

**해결:** 강력 새로고침 (Ctrl+Shift+R) 또는 시크릿 모드에서 확인
