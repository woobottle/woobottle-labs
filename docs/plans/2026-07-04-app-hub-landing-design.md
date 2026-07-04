# WooBottle 앱 허브 + 랜딩 생태계 설계

- 작성일: 2026-07-04
- 상태: 승인됨 (구현 대기)

## 목표

woobottle의 모바일 앱들에 **제대로 된 랜딩 페이지**를 만들고, 이를 묶는
**통합 `/apps` 허브**를 추가하며, 앱·허브·도구 사이트가 **서로 링크로 엮이게** 한다.

## 결정 사항 (확정)

- **허브 구조**: 루트(woo-bottle.com)는 기존 "웹 도구 모음" 랜딩 유지. 모바일 앱은 별도 `/apps` 허브에.
- **기술**: 전부 정적 HTML (`public/` 하위). Next 빌드와 분리, 앱별 브랜드색 자유 적용.
- **상호링크 소스**: `houseads.json` 단일 카탈로그를 런타임 fetch → 허브 그리드 + 각 랜딩 하단 "다른 앱" 스트립을 구동. (콘텐츠는 앱별 수작업 크래프트, 링크만 카탈로그 구동.)
- **범위**: 8개 앱 전부.

## 데이터 모델 — `houseads.json` v2

기존 1개(있는걸로) → 8개 전체로 확장. 인앱 `HouseAd`가 쓰는 기존 필드(`id/name/tagline/emoji/url/platform`)는 **그대로 유지**(앱 재빌드 불필요), 웹 필드만 추가.

```jsonc
{
  "id": "pillog",
  "name": "Pillog",
  "tagline": "약 챙기는 가장 간단한 방법",
  "emoji": "💊",
  "category": "건강",
  "brand": { "bg": "#16130F", "fg": "#F4EFE6", "accent": "#F2542A" },
  "landingUrl": "/pillog/",
  "url": "https://apps.apple.com/app/id6775165151",  // 스토어(인앱 기존 필드)
  "platform": "ios",
  "status": "live",           // 또는 "coming-soon" (스토어 버튼 숨김)
  "screenshots": ["/pillog/screenshots/01-home.png"]
}
```

### 앱 인벤토리

| id | 이름 | 이모지 | 카테고리 | bg / accent | 스토어 | status | 스샷 |
|---|---|---|---|---|---|---|---|
| pillog | Pillog | 💊 | 건강 | `#16130F` / `#F2542A` | id6775165151 | live | 5 |
| inneungeollo | 있는걸로 | 🍳 | 요리·AI | 웜 / `#F97316` | id6784326939 | live | 6 |
| voicealarm | 모닝보이스 | 🎙️ | 알람 | 다크 / `#FF3B30` | id6781772401 | live | 4 |
| couple-calendar | Couple Calendar | 📅 | 커플 | `#0f1a14` / `#5bbd8e` | id6781283358 | live | 0 |
| doodleroom | 낙서방 | 🎨 | 드로잉 | `#14110e` / `#FBD24E`·`#4FE0C9` | id6785241751 | live | 0 |
| imap | 아이맵 | 🏥 | 육아·의료 | `#1A1813` / `#5EEAD4` | id6779064016 | live | 0 |
| dailyignite | 하루불씨 | 🔥 | 동기부여 | 웜 / `#D4A574` | id6753808609 | live | 0 |
| squishpop | 빠작말랑 | 🫧 | 캐주얼 | `#FF8A5B` | — | coming-soon | 0 |

## 구성 요소

### 1) `/apps` 허브 — `public/apps/index.html`
- WooBottle 브랜드(루트 도구 사이트와 같은 다크 톤).
- 상단 nav: 도구 사이트(루트) ⇄ 앱 허브.
- `houseads.json` 런타임 fetch → 앱 카드 그리드(앱 accent·이모지·태그라인·플랫폼/coming-soon 뱃지 → `/<앱>/`).
- 하단 "웹 도구도 있어요 →" 루트 링크.

### 2) 앱 랜딩 템플릿 — `public/<앱>/index.html` (8개)
공통 구조 + 앱별 브랜드색(CSS 변수):
1. Nav: ← WooBottle(→ `/apps`) + 앱명
2. Hero: 카테고리 eyebrow + 앱명 + 태그라인 + App Store 뱃지 + 보조 링크 (coming-soon은 스토어 버튼 대신 뱃지)
3. 스크린샷 갤러리(가로 스크롤) — 스크린샷 있는 앱만(pillog/있는걸로/모닝보이스)
4. 핵심 기능 2~4개 (기존 support.html·blog에서 발췌)
5. "WooBottle의 다른 앱" 스트립 — `houseads.json` fetch, 자기 제외 → 형제 랜딩 (상호링크 핵심)
6. Footer: 존재하는 법적/블로그 링크만 + `/apps` 링크

기존 `public/pillog/index.html` 플레이스홀더는 이 템플릿으로 교체.

### 3) 루트 도구 사이트 연결
- 헤더/푸터(또는 랜딩 히어로 근처)에 `/apps` 링크 추가 → 도구 ↔ 앱 왕래.

## 상호링크 지도

```
루트(웹도구) ⇄ /apps 허브 ⇄ 각 /<앱>/ 랜딩 ⇄ (다른앱 스트립)형제 랜딩
        houseads.json → 허브 그리드 + 다른앱 스트립 + 인앱 하우스광고
```

## 페이지별 법적/블로그 링크 현황 (푸터 구성용)

- 풀(privacy/terms/support/blog): pillog, inneungeollo, voicealarm, couple-calendar, doodleroom
- privacy/terms/support (blog 없음): dailyignite, squishpop
- blog만 (법적 없음): imap

## 검증

- 각 랜딩/허브를 정적으로 열어(브라우저) 렌더·링크·houseads fetch 동작 확인.
- houseads.json에 잘못된 앱 추가 시 인앱 HouseAd가 깨지지 않는지(기존 필드 유지) 확인.
- 상대경로(`/houseads.json`, `/<앱>/`)가 woo-bottle.com 배포 기준으로 맞는지 확인.

## 부가 효과

지금은 카탈로그에 앱이 1개뿐이라 어떤 앱도 서로 홍보하지 않음. 8개 등록 시
모든 앱의 **인앱 하우스광고가 서로를 노출** + 웹에서도 상호 유입.
