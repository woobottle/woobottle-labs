# 배포 및 롤백 아키텍처

## 목차
1. [개요](#개요)
2. [전체 구조](#전체-구조)
3. [배포 플로우](#배포-플로우)
4. [롤백 플로우](#롤백-플로우)
5. [사용자 경험 시나리오](#사용자-경험-시나리오)
6. [PWA 대응](#pwa-대응)
7. [CloudFront 설정](#cloudfront-설정)

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

```
┌─────────────────────────────────────────────────────────────────┐
│                        CloudFront Distribution                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Behaviors (우선순위 순):                                         │
│                                                                  │
│  1. /sw.js           → Origin: S3 (Origin Path: 없음)           │
│  2. /manifest.json   → Origin: S3 (Origin Path: 없음)           │
│  3. /icons/*         → Origin: S3 (Origin Path: 없음)           │
│  4. /releases/*      → Origin: S3 (Origin Path: 없음)           │
│  5. Default (*)      → Origin: S3 (Origin Path: /releases/v3)   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         S3 Bucket                                │
│                      woo-bottle.com                              │
└─────────────────────────────────────────────────────────────────┘
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
│  Default Behavior의 Origin Path:                                 │
│    이전: /releases/deploy-20250116-120000-def5678               │
│    변경: /releases/deploy-20250117-090000-ghi9012               │
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

### 파일 배치

```
S3:
├── sw.js              ← 루트 (버전과 무관)
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

### 필요한 Behaviors

| 우선순위 | Path Pattern | Origin | Origin Path | 용도 |
|---------|--------------|--------|-------------|------|
| 0 | `/sw.js` | S3 | (없음) | Service Worker |
| 1 | `/manifest.json` | S3 | (없음) | PWA 매니페스트 |
| 2 | `/icons/*` | S3 | (없음) | 앱 아이콘 |
| 3 | `/releases/*` | S3 | (없음) | 모든 버전 접근 |
| 4 | `Default (*)` | S3 | `/releases/현재버전` | 새 사용자 라우팅 |

### 설정 방법 (콘솔)

```
1. CloudFront Console → Distribution 선택

2. Origins 탭 → 기존 S3 Origin 확인
   - Origin Path: 비어있어야 함 (또는 첫 배포 시 설정됨)

3. Behaviors 탭 → Create Behavior (4번 반복)

   Behavior 1:
   - Path Pattern: /sw.js
   - Origin: 기존 S3 Origin
   - Origin Path: (비워두기)

   Behavior 2:
   - Path Pattern: /manifest.json
   - Origin: 기존 S3 Origin
   - Origin Path: (비워두기)

   Behavior 3:
   - Path Pattern: /icons/*
   - Origin: 기존 S3 Origin
   - Origin Path: (비워두기)

   Behavior 4:
   - Path Pattern: /releases/*
   - Origin: 기존 S3 Origin
   - Origin Path: (비워두기)

4. Default Behavior는 deploy.yml이 자동 관리
   - 배포 시 Origin Path가 새 버전으로 업데이트됨
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
