# Monochrome Minimal Redesign — Design Spec

- Date: 2026-04-18
- Scope: woobottle-labs 전체 사이트 리디자인
- Style direction: Quiet Structure (블랙 베이스, 얇은 보더, 타이포 위계)

## 1. 목표와 원칙

주신 샘플 CSS(Inter 단독, 블랙 배경, 흰 텍스트, 반전 selection) 철학을
사이트 전체에 일관 적용한다. 라이트모드는 완전히 제거한다.

**설계 원칙**

1. 블랙 베이스, 모노크롬 한정 (채도 있는 컬러는 전부 제거)
2. 기능적 구분은 여백 · 얇은 보더 · 타이포 위계로 해결 (그림자/그라디언트/유리효과 금지)
3. 인터랙션은 색/보더 변화 위주. 스케일·플로팅·바운스 애니메이션 금지
4. Inter 단일 폰트로 모든 타이포 처리
5. `dark:` 프리픽스 전부 제거 (테마 토글 자체가 사라짐)

## 2. 디자인 토큰

### 컬러

| 토큰            | 값        | 용도                            |
| --------------- | --------- | ------------------------------- |
| `bg-base`       | `#000000` | `body`, 메인 배경               |
| `bg-elevated`   | `#0A0A0A` | 카드, 사이드바, 인풋 배경       |
| `border-subtle` | `#1A1A1A` | 기본 보더, 디바이더             |
| `border-strong` | `#2A2A2A` | 호버/활성 보더, secondary 버튼  |
| `text-primary`  | `#FFFFFF` | 제목, 본문 강조                 |
| `text-secondary`| `#A3A3A3` | 본문, 설명                      |
| `text-muted`    | `#525252` | 메타, 비활성, footer            |
| `accent`        | `#FFFFFF` | 인디케이터, 포커스 링, primary CTA |

Tailwind 사용 규칙: 임의값 `bg-[#0A0A0A]` 형태로 쓴다.
(Tailwind v3 config에 별도 컬러 팔레트 정의는 하지 않는다. YAGNI)

### 타이포

- Font: `Inter` (via `next/font/google`, weights: 300/400/500/600/700)
- Display (히어로 H1): `text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight`
- H2: `text-3xl font-semibold`
- H3 (카드 제목): `text-xl font-semibold`
- Body: `text-sm text-[#A3A3A3]` 또는 `text-base`
- Meta/Label: `text-xs text-[#525252] uppercase tracking-wide`

### 여백 & 모서리

- 카드 `rounded-xl` (12px), 버튼 `rounded-lg` (8px), 인풋 `rounded-lg`
- 컨테이너 `max-w-7xl mx-auto px-4 sm:px-6`
- 섹션 세로 간격 `py-16` 이상

### selection

```css
::selection {
  background-color: #FFFFFF;
  color: #000000;
}
```

## 3. globals.css 재작성

- 기존 `.glass-morphism`, `.stat-card`, `.button-primary`, `.button-secondary`,
  `.button-danger` 커스텀 컴포넌트 클래스 **전부 삭제**
- `body`: `bg-black text-white antialiased`, `font-family: Inter, ui-sans-serif, system-ui, sans-serif`
- `::selection` 반전 규칙 추가
- Tailwind 디렉티브(`@tailwind base/components/utilities`) 유지 (package.json 기준 v3)

## 4. layout.tsx (Root)

- `suppressHydrationWarning`, `lang="ko"` 유지
- `ThemeProvider` 래핑 **제거**
- body 클래스: `${inter.className} bg-black text-white antialiased`
- `<meta name="theme-color" content="#3b82f6">` → `content="#000000"`

## 5. LandingLayout (`widgets/landing-layout`)

- 배경 단색 블랙
- 헤더: 블러/유리효과 제거, `border-b border-[#1A1A1A]` 만
- 로고 옆 그라디언트 박스 → 흰 1px 보더 정사각형 (`border border-white w-9 h-9 rounded-xl`)
- `ThemeToggle` 렌더 제거
- 서브 라벨 `text-xs text-[#525252]`

## 6. 신규 `widgets/landing-hero`

기존 `widgets/visionos-hero` 를 **대체**한다 (visionos-hero 폴더는 통째로 삭제).

**구조**

```tsx
<section className="min-h-[80vh] flex flex-col justify-center">
  <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-6">
    WOOBOTTLE LABS
  </div>
  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
    일상과 업무를 위한
    <br />
    작은 도구들.
  </h1>
  <p className="text-lg text-[#A3A3A3] max-w-xl mb-10">
    글자수 카운터부터 뽀모도로 타이머까지,
    <br />
    생산성을 한 곳에서.
  </p>
  <div className="flex gap-3">
    <a className="btn-primary">도구 둘러보기 →</a>
    <Link className="btn-secondary">글자수 카운터</Link>
  </div>
</section>
```

- 좌측 정렬, 장식 없음, 플로팅 오브 없음
- 스크롤 내리면 도구 카드 그리드

## 7. 홈 페이지 (`components/pages/home`)

**도구 데이터 변경**

`tools` 배열 각 항목의 `color: 'from-blue-500 to-blue-600'` 필드 **삭제**.
(엔티티 `entities/tool/model/tools.ts` 의 `TOOLS` 에도 동일 정리)

**ToolCard 재설계**

```tsx
<Link href={tool.href} className="group block">
  <div className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-6
                  transition-colors duration-150
                  hover:border-[#2A2A2A]">
    <Icon className="w-6 h-6 text-white mb-6" strokeWidth={1.5} />
    <h3 className="text-xl font-semibold text-white mb-2">{tool.title}</h3>
    <p className="text-sm text-[#A3A3A3] mb-6">{tool.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#525252] uppercase tracking-wide">
        {tool.stats}
      </span>
      <ArrowRight
        className="w-4 h-4 text-[#525252] transition-transform
                   group-hover:translate-x-0.5 group-hover:text-white"
        strokeWidth={1.5}
      />
    </div>
  </div>
</Link>
```

**그리드**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

**제거 효과**: 스케일, shadow-xl, 유리효과 오버레이, 컬러 그라디언트 배경

## 8. AppLayout (`widgets/app-layout`)

- 배경 그라디언트 삭제 → `bg-black`
- `Sidebar` 는 고정 위치 유지
- 메인 컨테이너: `lg:ml-64`, 패딩 유지

## 9. Sidebar (`widgets/sidebar`)

- 배경 `bg-black`, 우측 보더 `border-r border-[#1A1A1A]`
- 블러/유리효과 모두 제거
- 로고: 텍스트 `WOOBOTTLE` (흰색) + 서브 `LABS` (`text-[#525252]`), 그라디언트 박스 제거
- 검색 인풋: `bg-[#0A0A0A] border border-[#1A1A1A] focus:border-white`
- 메뉴 아이템
  - 기본: `text-[#A3A3A3]`
  - 호버: `bg-[#0A0A0A] text-white`
  - 활성: `border-l-2 border-white bg-[#0A0A0A] text-white`
  - 아이콘 래퍼 박스/배경 제거, `strokeWidth={1.5}`
- 즐겨찾기 ⭐: 활성 `text-white fill-white`, 비활성 `text-[#525252]`
- Footer: `text-xs text-[#525252]`
- `ThemeToggle` 렌더 제거
- 모바일 햄버거: `bg-black border border-[#1A1A1A]`

## 10. 공용 UI 컴포넌트

### `shared/ui/button`

- `primary`: `bg-white text-black hover:bg-neutral-200 rounded-lg px-4 py-2 text-sm font-semibold`
- `secondary`: `border border-[#2A2A2A] text-white hover:border-white rounded-lg px-4 py-2 text-sm font-medium`
- `danger`: 채도 최소화 모노크롬 베이스 유지

### `shared/ui/input`

- `bg-[#0A0A0A] border border-[#1A1A1A] focus:border-white text-white placeholder:text-[#525252]`

### `shared/ui/card`

- `bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl`

### 기타

- `ThemeToggle` 파일 **유지**, 호출부만 제거
- `ThemeProvider` 호출부 제거. 파일 삭제는 후속 정리

## 11. 도구 페이지 내부 (feature-level)

이번 스펙에 **포함**. 대상 파일(주요):

- `features/pomodoro-timer/ui/*`
- `features/area-conversion/ui/area-converter.tsx`
- `features/currency-conversion/ui/currency-converter.tsx`
- `features/markdown-preview/ui/markdown-preview.tsx`
- `features/image-resizer/ui/image-resizer.tsx`
- `features/qr-code-generation/ui/qr-code-generator.tsx`
- `features/webp-conversion/ui/png-to-webp-converter.tsx`
- `features/dice-roller/ui/*`
- `components/pages/*` 각 페이지 래퍼(title/subtitle 영역)

**공통 변환 규칙**

| 기존                                    | 대체                                  |
| --------------------------------------- | ------------------------------------- |
| `bg-white` / `bg-gray-50`               | `bg-black` 또는 `bg-[#0A0A0A]`        |
| `text-gray-900`                         | `text-white`                          |
| `text-gray-600` / `text-gray-700`       | `text-[#A3A3A3]`                      |
| `text-gray-400` / `text-gray-500`       | `text-[#525252]`                      |
| `border-gray-200`                       | `border-[#1A1A1A]`                    |
| `bg-blue-500` / `bg-indigo-600`         | `bg-white text-black` (CTA) 또는 제거 |
| `text-blue-500` 등 포인트 컬러           | `text-white` 또는 `text-[#A3A3A3]`    |
| `from-xxx to-yyy` 그라디언트            | 단색 또는 제거                        |
| `shadow-sm` / `shadow-lg` / `shadow-xl` | 제거 (보더로 구분)                    |
| `backdrop-blur-*`                       | 제거                                  |
| `dark:*` 프리픽스                       | 전부 제거                             |
| `transition-all` + scale/shadow         | `transition-colors duration-150`      |

**특수 케이스**

- 뽀모도로 진행도 링: 진행 `text-white`, 트랙 `text-[#1A1A1A]`
- 주사위: 데이터에 컬러가 있어도 렌더 시 그레이스케일 매핑
- 마크다운 프리뷰: syntax 기본 모노크롬
- 통계(`/statistics`): 차트 `#FFFFFF / #A3A3A3 / #525252` 3단계만

## 12. 삭제/정리 항목

**완전 삭제**

- `widgets/visionos-hero/` 폴더
- `globals.css` 의 `.glass-morphism`, `.stat-card`, `.button-primary`, `.button-secondary`, `.button-danger`

**호출부 제거 (파일 유지)**

- `ThemeToggle` 렌더 (landing-layout, sidebar)
- `ThemeProvider` (layout.tsx)
- tool 객체의 `color` 필드

**전역 치환**

- `dark:*` 클래스 전수 제거 (33개 파일)
- 컬러 클래스 전수 치환 (44개 파일, 매핑표 기준)

## 13. 테스트 · 검증

- `pnpm lint` 통과
- `pnpm test` 통과
- 수동 스모크:
  1. `/` 랜딩 — 헤더/히어로/카드 그리드
  2. 각 도구 페이지 로드 후 컬러 잔존 확인
  3. 모바일 사이드바 토글/검색/활성 인디케이터
  4. `::selection` 반전 동작

## 14. 범위 밖 (Out of Scope)

- 기능 변경 일체 없음. 스타일만
- 폰트 loading 최적화, Tailwind v4 마이그레이션 — 별도 스펙
- 접근성 추가 개선 — 별도 스펙
- `ThemeToggle/ThemeProvider` 파일 자체 삭제 — 호출부 제거 후 후속 정리
- 도구 페이지 레이아웃/정보 구조 변경 — 컬러만

## 15. 리스크

1. **컬러 치환 범위가 큼** (44파일) → 구현 계획에서 파일/영역별 단계화
2. **`ThemeProvider` 잔존 참조 가능성** — `useTheme`/`import` grep 전수 확인
3. **도구별 컬러 데이터** — 렌더 시 중립화, 데이터는 유지
4. **테스트 클래스 assertion** — `bg-blue-*` 등 검사 테스트 동반 수정
