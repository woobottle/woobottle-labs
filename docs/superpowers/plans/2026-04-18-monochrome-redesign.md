# Monochrome Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 전체 사이트를 블랙 베이스 / 모노크롬 / 다크-온리 미니멀 디자인(Quiet Structure)으로 재스타일링한다.

**Architecture:** CSS 토큰/전역 스타일 → 셸(layout, sidebar) → 공용 UI 프리미티브 → 기능(feature) UI 순으로 하향 적용. 각 태스크는 컴파일·테스트·린트가 통과하는 안전한 커밋 단위.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v3, TypeScript, Jest + Testing Library.

**Spec Reference:** `docs/superpowers/specs/2026-04-18-monochrome-redesign-design.md`

---

## 공통 변환 사전 (모든 태스크에서 적용)

| 기존 (find)                          | 대체 (replace)                         |
| ------------------------------------ | -------------------------------------- |
| `bg-white` (단독)                    | `bg-black` (래퍼) / `bg-[#0A0A0A]` (카드) |
| `bg-gray-50` / `bg-gray-100`          | `bg-[#0A0A0A]`                        |
| `bg-gray-800` / `bg-gray-900`         | `bg-[#0A0A0A]`                        |
| `text-gray-900` / `text-gray-800`     | `text-white`                          |
| `text-gray-700` / `text-gray-600`     | `text-[#A3A3A3]`                      |
| `text-gray-500` / `text-gray-400`     | `text-[#525252]`                      |
| `border-gray-200` / `border-gray-300` | `border-[#1A1A1A]`                    |
| `border-gray-700` / `border-gray-800` | `border-[#1A1A1A]`                    |
| `bg-blue-*` / `bg-indigo-*` 등         | `bg-white text-black` (primary CTA) 또는 `bg-[#0A0A0A]` |
| `text-blue-*` / `text-indigo-*` 등     | `text-white` 또는 `text-[#A3A3A3]`     |
| `from-xxx` / `to-yyy` / `via-zzz`      | 제거 (단색으로 축소)                   |
| `bg-gradient-to-*`                   | 제거                                   |
| `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-xl` / `shadow-2xl` | 제거 |
| `backdrop-blur-*`                    | 제거                                   |
| `dark:<anything>`                    | 전부 삭제 (같은 단어째 제거)           |
| `transition-all`                     | `transition-colors duration-150`      |
| `hover:scale-*` / `active:scale-*`    | 제거                                   |
| `hover:shadow-*`                      | 제거                                   |
| `animate-*` (float 등 장식용)         | 제거 (기능성 애니메이션은 유지)        |

아이콘 strokeWidth: `lucide-react` 아이콘 모두 `strokeWidth={1.5}` 로 설정.

각 태스크 공통 검증:
- `pnpm lint` 통과
- `pnpm test` 통과 (영향받는 스냅샷/클래스 어설션 있으면 같이 수정)

---

## Task 1: 전역 스타일 & 루트 레이아웃 (Foundation)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/shared/lib/index.ts`

- [ ] **Step 1: `src/app/globals.css` 전면 교체**

파일 전체를 아래로 대체:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, 'Noto Sans KR', sans-serif;
  }

  body {
    @apply bg-black text-white antialiased;
  }

  ::selection {
    background-color: #ffffff;
    color: #000000;
  }
}
```

기존 `.glass-morphism`, `.stat-card`, `.button-primary`, `.button-secondary`, `.button-danger` 컴포넌트 클래스는 모두 삭제된다.

- [ ] **Step 2: `src/app/layout.tsx` 수정**

파일 전체를 아래로 대체:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "WooBottle Labs",
  description: "일상과 업무를 위한 작은 도구 모음",
  keywords: "생산성, 도구, 글자수, 계산기, 변환기, 타이머",
  authors: [{ name: "WooBottle Labs" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WooBottle Labs",
  },
  openGraph: {
    title: "WooBottle Labs",
    description: "일상과 업무를 위한 작은 도구 모음",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script src="/version.js" async />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="WooBottle Labs" />
        <link rel="apple-touch-icon" href="/pwa/icon-192x192.svg" />
        <script src="/register-sw.js" async />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

주요 변경:
- `ThemeProvider` import/사용 제거
- body 클래스 블랙 고정
- `theme-color` 메타 → `#000000`
- Inter 폰트에 weight 배열 명시

- [ ] **Step 3: `src/shared/lib/index.ts` 에서 `theme-provider` export 제거**

기존:
```ts
export * from './utils';
export * from './theme-provider';
```

새 내용:
```ts
export * from './utils';
```

(파일 `theme-provider.tsx` 자체는 아직 삭제하지 않음 — theme-toggle 이 참조 중. Step 4에서 처리 안함, Task 2에서 toggle 호출부 제거 후 Task 12에서 일괄 정리)

- [ ] **Step 4: 빌드/린트/테스트 확인**

```bash
pnpm lint
pnpm test
```

Expected: 통과. 만약 `ThemeProvider` import가 남아있어 실패하면 해당 파일을 열어 제거 (발견되면 메모해두고 다음 태스크에서 처리).

- [ ] **Step 5: 커밋**

```bash
git add src/app/globals.css src/app/layout.tsx src/shared/lib/index.ts
git commit -m "style: Switch global styles to monochrome dark base"
```

---

## Task 2: Theme 관련 호출 제거 & 공용 UI 프리미티브 재작성

**Files:**
- Modify: `src/shared/ui/button/button.tsx`
- Modify: `src/shared/ui/input/input.tsx`
- Modify: `src/shared/ui/card/card.tsx`
- Modify: `src/widgets/sidebar/ui/sidebar.tsx` (ThemeToggle 렌더만 제거)
- Modify: `src/widgets/landing-layout/ui/landing-layout.tsx` (ThemeToggle 렌더만 제거)
- Modify: `src/shared/ui/__tests__/button.test.tsx` (클래스 어설션 수정)

- [ ] **Step 1: `button.tsx` 전체 교체**

```tsx
'use client';

import React from 'react';
import { cn } from 'shared/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses = {
  default:   'border border-[#1A1A1A] bg-[#0A0A0A] text-white hover:border-[#2A2A2A]',
  primary:   'bg-white text-black hover:bg-neutral-200',
  secondary: 'border border-[#2A2A2A] text-white hover:border-white',
  success:   'border border-[#1A1A1A] bg-[#0A0A0A] text-white hover:border-[#2A2A2A]',
  danger:    'border border-[#2A2A2A] text-white hover:border-red-500/60',
  warning:   'border border-[#2A2A2A] text-white hover:border-[#2A2A2A]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
```

설계 결정: `success` / `warning` 은 채도를 없애 `default` 와 거의 같은 모노크롬 베이스로 통일 (의미 구분은 텍스트/아이콘 라벨이 담당). `danger` 만 호버에 엷은 빨간 보더 허용.

- [ ] **Step 2: `input.tsx` 전체 교체**

```tsx
'use client';

import React from 'react';
import { cn } from 'shared/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  label?: string;
  error?: string;
  helperText?: string;
}

const variantClasses = {
  default: 'border-[#1A1A1A] focus:border-white',
  error:   'border-red-500/60 focus:border-red-500/80',
  success: 'border-[#2A2A2A] focus:border-white',
};

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const finalVariant = error ? 'error' : variant;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#A3A3A3] mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-lg text-base',
          'bg-[#0A0A0A] text-white placeholder:text-[#525252]',
          'border focus:outline-none transition-colors duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variantClasses[finalVariant],
          className,
        )}
        {...props}
      />
      {(error || helperText) && (
        <div className="mt-2">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && helperText && <p className="text-sm text-[#525252]">{helperText}</p>}
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 3: `card.tsx` 전체 교체**

```tsx
'use client';

import React from 'react';
import { cn } from 'shared/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses = {
  default:  'bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl',
  elevated: 'bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl',
  bordered: 'bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(variantClasses[variant], paddingClasses[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};
```

- [ ] **Step 4: `sidebar.tsx` 에서 ThemeToggle 렌더만 제거**

수정 대상:
- `import { ThemeToggle } from 'shared/ui/theme-toggle';` 라인 삭제
- JSX 내 `<div className="p-4"><ThemeToggle /></div>` 블록 삭제 (파일 하단 Bottom Section)
- 나머지는 Task 5에서 전체 리스타일

- [ ] **Step 5: `landing-layout.tsx` 에서 ThemeToggle 렌더만 제거**

수정 대상:
- `import { ThemeToggle } from 'shared/ui/theme-toggle';` 라인 삭제
- JSX 내 `<ThemeToggle />` 제거
- 나머지는 Task 3에서 전체 리스타일

- [ ] **Step 6: `button.test.tsx` 클래스 어설션 수정**

현 테스트 파일을 열어 `bg-blue-*`, `bg-gray-*`, `dark:*` 등의 구체 클래스 어설션을 찾아 새 variant 클래스(`bg-white`, `border-[#1A1A1A]` 등)로 수정. 만약 테스트가 순수 시맨틱(버튼 렌더/클릭)만 검사 중이라면 수정 불필요.

Run: `pnpm test -- --testPathPattern="button"`
Expected: PASS

- [ ] **Step 7: 전체 린트/테스트**

```bash
pnpm lint
pnpm test
```

Expected: 통과. 실패 시 ThemeToggle/ThemeProvider 잔존 참조가 있을 수 있음 — `grep -R "ThemeToggle\|useTheme" src` 로 확인.

- [ ] **Step 8: 커밋**

```bash
git add src/shared/ui/button/button.tsx src/shared/ui/input/input.tsx src/shared/ui/card/card.tsx src/widgets/sidebar/ui/sidebar.tsx src/widgets/landing-layout/ui/landing-layout.tsx src/shared/ui/__tests__/button.test.tsx
git commit -m "style: Monochrome rewrite of shared UI primitives, remove ThemeToggle wiring"
```

---

## Task 3: LandingLayout 리스타일 + 신규 LandingHero + VisionOsHero 삭제

**Files:**
- Modify: `src/widgets/landing-layout/ui/landing-layout.tsx`
- Create: `src/widgets/landing-hero/ui/landing-hero.tsx`
- Create: `src/widgets/landing-hero/index.ts`
- Delete: `src/widgets/visionos-hero/` (폴더 전체)

- [ ] **Step 1: `landing-layout.tsx` 전체 교체**

```tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-[#1A1A1A] bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-white" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">WooBottle Labs</div>
              <div className="text-xs text-[#525252]">Productivity tools</div>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
};
```

- [ ] **Step 2: 신규 `landing-hero.tsx` 작성**

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  primaryHref?: string;
  secondaryHref?: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  primaryHref = '#tools',
  secondaryHref = '/text-counter',
}) => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-16">
      <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-6">
        WOOBOTTLE LABS
      </div>
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
        일상과 업무를 위한
        <br />
        작은 도구들.
      </h1>
      <p className="text-lg text-[#A3A3A3] max-w-xl mb-10">
        글자수 카운터부터 뽀모도로 타이머까지,
        <br />
        생산성을 한 곳에서.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={primaryHref}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors duration-150 hover:bg-neutral-200"
        >
          도구 둘러보기
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </a>
        <Link
          href={secondaryHref}
          className="inline-flex items-center rounded-lg border border-[#2A2A2A] px-5 py-3 text-sm font-medium text-white transition-colors duration-150 hover:border-white"
        >
          글자수 카운터
        </Link>
      </div>
    </section>
  );
};
```

- [ ] **Step 3: 신규 `src/widgets/landing-hero/index.ts`**

```ts
export { LandingHero } from './ui/landing-hero';
```

- [ ] **Step 4: `visionos-hero` 폴더 삭제**

```bash
rm -rf src/widgets/visionos-hero
```

`components/pages/home/ui/home-page.tsx` 에 남은 `from 'widgets/visionos-hero'` import 는 Task 4에서 교체.

- [ ] **Step 5: 린트/테스트**

```bash
pnpm lint
pnpm test
```

현 상태에서 home-page.tsx 가 빌드를 깰 수 있음 — 다음 Task 4와 함께 커밋할 수 있도록 이 단계에서는 커밋하지 않고 Task 4 시작 전까지 브랜치에 스테이지 상태로 둔다.

- [ ] **Step 6: (이 태스크에서 커밋하지 않음) 상태 확인만**

```bash
git status
```

Expected: `modified: landing-layout.tsx`, `new file: landing-hero/...`, `deleted: visionos-hero/...`

---

## Task 4: 홈 페이지 (HomePage + ToolCard) & tool 엔티티 color 필드 정리

**Files:**
- Modify: `src/components/pages/home/ui/home-page.tsx`
- Modify: `src/entities/tool/model/types.ts` (이 파일에 `color` 필드가 있다면 제거)

- [ ] **Step 1: `home-page.tsx` 전체 교체**

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Clock,
  FileText,
  Home,
  Image as ImageIcon,
  Info,
  Settings,
  Smartphone,
} from 'lucide-react';

import { LandingLayout } from 'widgets/landing-layout';
import { LandingHero } from 'widgets/landing-hero';

const tools = [
  {
    id: 'text-counter',
    title: '글자수 카운터',
    description: '실시간으로 글자, 단어, 줄 수를 계산합니다',
    icon: FileText,
    href: '/text-counter',
    stats: '실시간 분석',
  },
  {
    id: 'calculator',
    title: '계산기',
    description: '간단한 사칙연산을 수행할 수 있습니다',
    icon: Calculator,
    href: '/calculator',
    stats: '사칙연산',
  },
  {
    id: 'area-converter',
    title: '평수 변환기',
    description: '아파트 평수를 제곱미터로, 제곱미터를 평수로 변환합니다',
    icon: Home,
    href: '/area-converter',
    stats: '부동산 전문',
  },
  {
    id: 'icon-generator',
    title: '아이콘 생성기',
    description: '하나의 이미지로 모든 플랫폼용 아이콘을 생성합니다',
    icon: Smartphone,
    href: '/icon-generator',
    stats: 'iOS / Android / Web',
  },
  {
    id: 'image-resizer',
    title: '이미지 리사이저',
    description: '이미지를 업로드하고 원하는 크기로 조절하세요',
    icon: ImageIcon,
    href: '/image-resizer',
    stats: '크기 조절',
  },
  {
    id: 'statistics',
    title: '통계 분석',
    description: '상세한 텍스트 및 사용 통계를 확인하세요',
    icon: BarChart3,
    href: '/statistics',
    stats: '데이터 시각화',
  },
  {
    id: 'timer',
    title: '뽀모도로 타이머',
    description: '집중력을 높이고 생산성을 향상시키는 시간 관리 기법',
    icon: Clock,
    href: '/timer',
    stats: '집중력 향상',
  },
  {
    id: 'settings',
    title: '설정',
    description: '앱 환경을 원하는 대로 설정하세요',
    icon: Settings,
    href: '/settings',
    stats: '개인화',
  },
  {
    id: 'about',
    title: '정보',
    description: '앱에 대한 자세한 정보를 확인하세요',
    icon: Info,
    href: '/about',
    stats: '프로젝트 소개',
  },
] as const;

const ToolCard = ({ tool }: { tool: (typeof tools)[number] }) => {
  const Icon = tool.icon;

  return (
    <Link href={tool.href} className="group block">
      <div className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-6 transition-colors duration-150 hover:border-[#2A2A2A]">
        <Icon className="w-6 h-6 text-white mb-6" strokeWidth={1.5} />
        <h3 className="text-xl font-semibold text-white mb-2">{tool.title}</h3>
        <p className="text-sm text-[#A3A3A3] mb-6">{tool.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#525252] uppercase tracking-wide">{tool.stats}</span>
          <ArrowRight
            className="w-4 h-4 text-[#525252] transition-colors duration-150 group-hover:text-white"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </Link>
  );
};

export const HomePage: React.FC = () => {
  return (
    <LandingLayout>
      <LandingHero />

      <section id="tools" className="py-16">
        <div className="mb-10">
          <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">TOOLS</div>
          <h2 className="text-3xl font-semibold text-white">전체 도구</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </LandingLayout>
  );
};
```

- [ ] **Step 2: `src/entities/tool/model/types.ts` 확인 및 수정**

파일을 열어 `color` 필드가 있으면 제거. 없다면 스킵.

Run: `grep -n "color" src/entities/tool/model/types.ts`

- [ ] **Step 3: 린트/빌드/테스트**

```bash
pnpm lint
pnpm test
```

Expected: 통과. `visionos-hero` import 잔존 없어야 함 → `grep -R "visionos-hero" src` 결과 비어야 함.

- [ ] **Step 4: 커밋 (Task 3+4 묶어서)**

```bash
git add src/widgets/landing-layout src/widgets/landing-hero src/widgets/visionos-hero src/components/pages/home/ui/home-page.tsx src/entities/tool/model/types.ts
git commit -m "feat(home): Replace vision-os hero with minimal typography hero, monochrome tool cards"
```

---

## Task 5: AppLayout + Sidebar 리스타일

**Files:**
- Modify: `src/widgets/app-layout/ui/app-layout.tsx`
- Modify: `src/widgets/sidebar/ui/sidebar.tsx`

- [ ] **Step 1: `app-layout.tsx` 전체 교체**

```tsx
'use client';

import React from 'react';
import { Sidebar } from 'widgets/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-black text-white">
      <Sidebar />
      <div className="lg:ml-64">
        <div className="container mx-auto px-4 py-8 max-w-6xl lg:px-8">{children}</div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: `sidebar.tsx` 전체 교체**

```tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Star, X } from 'lucide-react';

import { TOOLS } from 'entities/tool';
import { useToolFavorites } from 'features/tool-favorites';
import { Input } from 'shared/ui/input';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const { favoritesSet, toggleFavorite } = useToolFavorites();

  const toggleSidebar = () => setIsOpen((v) => !v);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredTools = TOOLS.filter((tool) => {
    if (!normalizedQuery) return true;
    return (
      tool.label.toLowerCase().includes(normalizedQuery) ||
      tool.href.toLowerCase().includes(normalizedQuery) ||
      (tool.description?.toLowerCase().includes(normalizedQuery) ?? false)
    );
  });

  const favoriteTools = filteredTools.filter((t) => favoritesSet.has(t.id));
  const otherTools = filteredTools.filter((t) => !favoritesSet.has(t.id));

  const renderToolLink = (item: (typeof TOOLS)[number]) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    const isFavorite = favoritesSet.has(item.id);

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={`
          relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
          transition-colors duration-150
          ${isActive
            ? 'bg-[#0A0A0A] text-white border-l-2 border-white pl-[10px]'
            : 'text-[#A3A3A3] hover:bg-[#0A0A0A] hover:text-white'
          }
        `}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Icon
            className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#A3A3A3]'}`}
            strokeWidth={1.5}
          />
          <div className="min-w-0 text-left">
            <p className={`truncate text-sm font-medium ${isActive ? 'text-white' : ''}`}>
              {item.label}
            </p>
            {item.description && (
              <p className="truncate text-xs text-[#525252]">{item.description}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 등록'}
          title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 등록'}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#1A1A1A]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
        >
          <Star
            className={`h-4 w-4 ${isFavorite ? 'text-white' : 'text-[#525252]'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black border border-[#1A1A1A] text-white transition-colors duration-150 hover:border-[#2A2A2A]"
      >
        {isOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed left-0 top-0 w-64 h-[100dvh] bg-black border-r border-[#1A1A1A] z-40
          flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-[#1A1A1A] flex-shrink-0">
          <Link href="/" className="block" onClick={() => setIsOpen(false)}>
            <div className="text-base font-bold tracking-tight">WOOBOTTLE</div>
            <div className="text-xs text-[#525252] uppercase tracking-[0.2em]">Labs</div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain p-4">
          <div className="sticky top-0 z-10 mb-4 bg-black pb-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#525252]"
                strokeWidth={1.5}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="도구 검색…"
                className="px-3 py-2 pl-9 text-sm"
              />
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#1A1A1A] p-4 text-sm text-[#525252]">
              검색 결과가 없어요.
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteTools.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-1 text-xs uppercase tracking-wide text-[#525252]">
                    <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                    즐겨찾기
                  </div>
                  <div className="space-y-1">{favoriteTools.map(renderToolLink)}</div>
                </div>
              )}

              {otherTools.length > 0 && (
                <div>
                  {favoriteTools.length > 0 && (
                    <div className="mb-2 px-1 text-xs uppercase tracking-wide text-[#525252]">
                      전체
                    </div>
                  )}
                  <div className="space-y-1">{otherTools.map(renderToolLink)}</div>
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="flex-shrink-0 border-t border-[#1A1A1A]">
          <div className="px-4 py-4 text-center text-xs text-[#525252]">
            <p>v1.0.0</p>
            <p className="mt-1">© 2024 WooBottle Labs</p>
          </div>
        </div>
      </div>
    </>
  );
};
```

주요 변경: 유리효과/블러 제거, 로고 그라디언트 박스 제거(텍스트 로고), 활성 상태 좌측 1px 보더 인디케이터, 아이콘 래퍼 박스 제거, ThemeToggle 호출 없음.

- [ ] **Step 3: 도구 페이지 두 개 smoke 확인**

```bash
pnpm dev
```

브라우저로 `/timer` 와 `/calculator` 에 접속해 사이드바 동작(활성 상태, 호버, 모바일 토글)과 블랙 배경 확인. 서버 종료.

- [ ] **Step 4: 린트/테스트/커밋**

```bash
pnpm lint
pnpm test
git add src/widgets/app-layout src/widgets/sidebar
git commit -m "style(app): Monochrome AppLayout and Sidebar with indicator-style active state"
```

---

## Task 6: `features/pomodoro-timer` 모노크롬화

**Files:**
- Modify: `src/features/pomodoro-timer/ui/timer-display.tsx`
- Modify: `src/features/pomodoro-timer/ui/timer-stats.tsx`
- Modify: `src/features/pomodoro-timer/ui/timer-settings.tsx`
- Modify: `src/features/pomodoro-timer/ui/pomodoro-timer.tsx`
- Modify: `src/components/pages/timer/ui/timer-page.tsx`
- Modify: `src/features/pomodoro-timer/__tests__/timer-display.test.tsx` (필요시)
- Modify: `src/features/pomodoro-timer/__tests__/timer-controls.test.tsx` (필요시)

- [ ] **Step 1: 각 파일을 열어 공통 변환 사전(상단 표) 규칙을 적용**

특수 처리:
- `timer-display.tsx` 의 상태별 컬러 반환 함수:
  ```
  'text-red-600 dark:text-red-400'   → 'text-white'
  'text-green-600 dark:text-green-400' → 'text-white'
  'text-blue-600 dark:text-blue-400' → 'text-white'
  'text-gray-600 dark:text-gray-400' → 'text-[#A3A3A3]'
  ```
  모든 상태가 동일한 흰색이 됨 — 상태 구분은 타이머 라벨 텍스트(`집중`, `휴식` 등)로만 표현.
- 원형 진행 링: 진행 stroke `text-white`, 배경 트랙 `text-[#1A1A1A]`
- `bg-white/80 backdrop-blur-sm shadow-sm` 등 스탯 카드 스타일 → `bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl`

- [ ] **Step 2: 테스트 파일에서 클래스 어설션 수정**

```bash
grep -n "bg-blue\|dark:\|from-\|text-blue\|text-green\|text-red" src/features/pomodoro-timer/__tests__/*.tsx
```

발견된 어설션을 새 클래스로 수정하거나, 어설션 자체가 불필요하면 삭제.

- [ ] **Step 3: 린트/테스트**

```bash
pnpm lint
pnpm test -- --testPathPattern="pomodoro|timer"
```

Expected: PASS.

- [ ] **Step 4: 수동 스모크**

`pnpm dev` 후 `/timer` 에서 시작/정지/설정 동작과 컬러 확인. 서버 종료.

- [ ] **Step 5: 커밋**

```bash
git add src/features/pomodoro-timer src/components/pages/timer
git commit -m "style(timer): Monochrome pomodoro timer UI"
```

---

## Task 7: `features/area-conversion`, `features/currency-conversion`, `features/markdown-preview`

**Files:**
- Modify: `src/features/area-conversion/ui/area-converter.tsx`
- Modify: `src/features/currency-conversion/ui/currency-converter.tsx`
- Modify: `src/features/markdown-preview/ui/markdown-preview.tsx`
- Modify: `src/components/pages/area-converter/ui/area-converter-page.tsx`
- Modify: `src/components/pages/currency-converter/ui/currency-converter-page.tsx`
- Modify: `src/components/pages/markdown-preview/ui/markdown-preview-page.tsx`

- [ ] **Step 1: 각 파일에 공통 변환 사전 적용**

특수 처리:
- `markdown-preview` 의 prose 컬러:
  - `prose prose-blue` → `prose prose-invert`
  - 또는 `prose` 기본값 제거 후 inline 스타일 필요 여부만 확인
  - 코드 블록 배경 `bg-gray-100` → `bg-[#0A0A0A]`
- `currency-converter` 의 환율 변동 표시(+/-) 색상: 기존 `text-green-*` / `text-red-*` → `text-white` (부호 기호로 의미 전달) 또는 `text-[#A3A3A3]`로 통일
- `area-converter` 의 결과 카드 스타일: `bg-white shadow` → `bg-[#0A0A0A] border border-[#1A1A1A]`

- [ ] **Step 2: 린트/테스트**

```bash
pnpm lint
pnpm test -- --testPathPattern="area|currency|markdown"
```

- [ ] **Step 3: 수동 스모크**

`pnpm dev` 후 `/area-converter`, `/currency-converter`, `/markdown-preview` 접속 확인.

- [ ] **Step 4: 커밋**

```bash
git add src/features/area-conversion src/features/currency-conversion src/features/markdown-preview src/components/pages/area-converter src/components/pages/currency-converter src/components/pages/markdown-preview
git commit -m "style: Monochrome area/currency/markdown features"
```

---

## Task 8: `features/image-resizer`, `features/qr-code-generation`, `features/webp-conversion`

**Files:**
- Modify: `src/features/image-resizer/ui/image-resizer.tsx`
- Modify: `src/features/qr-code-generation/ui/qr-code-generator.tsx`
- Modify: `src/features/webp-conversion/ui/png-to-webp-converter.tsx`
- Modify: `src/components/pages/image-resizer/ui/image-resizer-page.tsx` (존재 시)
- Modify: `src/components/pages/qr-code-generator/ui/qr-code-generator-page.tsx`
- Modify: `src/components/pages/png-to-webp/ui/png-to-webp-page.tsx`

- [ ] **Step 1: 공통 변환 사전 적용**

특수 처리:
- 파일 드랍존 호버: `border-blue-500 bg-blue-50` → `border-white bg-[#0A0A0A]`
- 진행률 바(업로드/변환 중): 기존 컬러 바 → `bg-white`, 트랙 `bg-[#1A1A1A]`
- QR 결과 렌더 배경: 흰 배경 유지 필요 (QR 인쇄 가독성) — 결과 래퍼만 `bg-white` 유지, 주변 카드는 모노크롬
- 이미지 프리뷰 섬네일 카드: `bg-[#0A0A0A] border border-[#1A1A1A]`

- [ ] **Step 2: 린트/테스트**

```bash
pnpm lint
pnpm test -- --testPathPattern="image|qr|webp|png"
```

- [ ] **Step 3: 수동 스모크**

`pnpm dev` 후 `/image-resizer`, `/qr-code-generator`, `/png-to-webp` 접속 확인.

- [ ] **Step 4: 커밋**

```bash
git add src/features/image-resizer src/features/qr-code-generation src/features/webp-conversion src/components/pages/image-resizer src/components/pages/qr-code-generator src/components/pages/png-to-webp
git commit -m "style: Monochrome image/qr/webp features"
```

---

## Task 9: `features/dice-roller` + name-generator

**Files:**
- Modify: `src/features/dice-roller/ui/dice-roller.tsx`
- Modify: `src/features/dice-roller/ui/dice-display.tsx`
- Modify: `src/components/pages/dice-roller/ui/dice-roller-page.tsx`
- Modify: `src/components/pages/name-generator/ui/name-generator-page.tsx`
- (name-generator feature 디렉토리가 있다면 동반) `src/features/name-generation/ui/*`

- [ ] **Step 1: 공통 변환 사전 적용**

특수 처리:
- `dice-display` 의 주사위 면 색상: 데이터에 컬러 코드가 있다면 렌더 시 무시하고 `bg-[#0A0A0A] border border-[#1A1A1A] text-white` 로 통일
- `name-generator` 의 성별/카테고리 칩: 컬러 뱃지 → `border border-[#2A2A2A] text-[#A3A3A3]` 단색 칩

- [ ] **Step 2: 린트/테스트**

```bash
pnpm lint
pnpm test -- --testPathPattern="dice|name"
```

- [ ] **Step 3: 수동 스모크**

`pnpm dev` 후 `/dice-roller`, `/name-generator` 접속 확인.

- [ ] **Step 4: 커밋**

```bash
git add src/features/dice-roller src/features/name-generation src/components/pages/dice-roller src/components/pages/name-generator
git commit -m "style: Monochrome dice and name generator"
```

---

## Task 10: 단순 페이지 래퍼 일괄 (text-counter, calculator, icon-generator, settings, about, statistics)

**Files:**
- Modify: `src/app/text-counter/page.tsx`
- Modify: `src/app/calculator/page.tsx`
- Modify: `src/app/icon-generator/ui/` 또는 `src/components/pages/icon-generator/ui/icon-generator-page.tsx`
- Modify: `src/app/settings/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/statistics/page.tsx`
- Modify: `src/features/icon-generation/ui/*` (있다면)

- [ ] **Step 1: 각 파일에 공통 변환 사전 적용**

페이지 타이틀 영역 공통 패턴:
```tsx
<div className="mb-10">
  <div className="text-xs text-[#525252] uppercase tracking-[0.2em] mb-3">페이지 타입</div>
  <h1 className="text-3xl font-semibold text-white">페이지 타이틀</h1>
  <p className="mt-2 text-[#A3A3A3]">페이지 설명</p>
</div>
```

설정 페이지 스위치/토글 컴포넌트:
- 활성: `bg-white`, 노브 `bg-black`
- 비활성: `bg-[#1A1A1A]`, 노브 `bg-[#525252]`

Statistics 차트:
- 데이터 시각화 색상은 `#FFFFFF`, `#A3A3A3`, `#525252` 3단계만 사용

- [ ] **Step 2: 린트/테스트**

```bash
pnpm lint
pnpm test
```

- [ ] **Step 3: 수동 스모크**

각 페이지 접속 및 기본 동작 확인.

- [ ] **Step 4: 커밋**

```bash
git add src/app/text-counter src/app/calculator src/app/icon-generator src/app/settings src/app/about src/app/statistics src/features/icon-generation src/components/pages/icon-generator
git commit -m "style: Monochrome remaining page wrappers"
```

---

## Task 11: ThemeProvider / ThemeToggle 파일 삭제 + version-info 등 잔여 공용 컴포넌트

**Files:**
- Delete: `src/shared/ui/theme-toggle/` (폴더 전체)
- Delete: `src/shared/lib/theme-provider.tsx`
- Modify: `src/shared/ui/version-info/version-info.tsx`
- Modify: `src/features/tool-favorites/` (컬러 잔존 시)

- [ ] **Step 1: 잔존 참조 확인**

```bash
grep -R "ThemeToggle\|ThemeProvider\|useTheme\|theme-toggle\|theme-provider" src
```

Expected: 결과 없음. 남아 있다면 해당 파일에서 제거.

- [ ] **Step 2: 폴더/파일 삭제**

```bash
rm -rf src/shared/ui/theme-toggle
rm src/shared/lib/theme-provider.tsx
```

- [ ] **Step 3: `version-info.tsx` 및 tool-favorites UI 에 공통 변환 사전 적용**

- [ ] **Step 4: 린트/테스트**

```bash
pnpm lint
pnpm test
```

Expected: 통과.

- [ ] **Step 5: 커밋**

```bash
git add src/shared/ui/theme-toggle src/shared/lib/theme-provider.tsx src/shared/ui/version-info src/features/tool-favorites
git commit -m "chore: Remove theme toggle infrastructure, polish remaining shared UI"
```

---

## Task 12: 최종 스윕 & 검증

**Files:**
- 이전 태스크에서 놓친 파일 any

- [ ] **Step 1: 컬러 잔존 전수 검사**

```bash
grep -RIn --include="*.tsx" --include="*.ts" -E "dark:|from-(blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan)|to-(blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan)|bg-(blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan)-[0-9]|text-(blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan)-[0-9]|shadow-lg|shadow-xl|shadow-2xl|backdrop-blur" src
```

Expected: 출력 없음(또는 `text-red-400/60` 같이 의도적으로 남긴 위험/에러 표시만).

남은 파일 있으면 공통 변환 사전에 따라 수정.

- [ ] **Step 2: 글자수 카운터 feature (if exists)**

`src/features` 아래 `text-counter` 또는 관련 디렉토리가 있는지 확인하고 컬러 잔존 검사.

- [ ] **Step 3: 전체 린트/타입체크/테스트**

```bash
pnpm lint
pnpm test
pnpm build
```

Expected: 모두 통과. `pnpm build` 는 static export 도 성공해야 함.

- [ ] **Step 4: 수동 스모크 전수**

`pnpm dev` 후 아래 경로 순회:
- `/` — 랜딩 히어로 + 도구 그리드
- `/text-counter` `/calculator` `/area-converter` `/currency-converter` `/icon-generator` `/image-resizer` `/qr-code-generator` `/png-to-webp` `/markdown-preview` `/name-generator` `/dice-roller` `/statistics` `/timer` `/settings` `/about`
- 사이드바 검색 + 즐겨찾기 + 모바일 토글
- `::selection` 반전 — 텍스트 드래그로 확인

- [ ] **Step 5: 최종 커밋 (필요시)**

스윕에서 발견된 잔여 수정 사항만:

```bash
git add -u
git commit -m "style: Final monochrome sweep"
```

- [ ] **Step 6: 작업 완료 요약**

```bash
git log --oneline origin/test..HEAD
```

커밋 리스트를 확인하고 PR/머지 준비.

---

## Self-Review Notes

- **스펙 커버리지:** 스펙 1~15장의 모든 항목이 태스크 1~12에 매핑됨. 토큰(스펙 §2) → Task 1,2의 util 클래스에 임의값으로 반영. visionos-hero 삭제(§12) → Task 3. tool `color` 필드(§12) → Task 4. ThemeProvider 호출부/파일(§10, §14) → Task 2에서 호출부, Task 11에서 파일 삭제.
- **TDD 조정:** 본 작업은 스타일 전환이라 클래식 TDD(실패 테스트 → 구현) 대신 `lint + 기존 테스트 갱신 + 수동 스모크` 로 검증을 구성. 클래스 어설션이 있는 테스트는 태스크 내부에서 동반 수정.
- **컴파일 안정성:** 태스크 순서는 항상 다음 태스크 시작 시 빌드가 깨지지 않게 설계되었으나, Task 3은 home-page의 visionos-hero 참조를 깸 → Task 4에서 바로 이어 처리하고 **두 태스크를 한 커밋**으로 묶는다.
- **리스크:** Task 6–10 사이에서 각 feature 의 개별 색상 로직이 예상과 다를 수 있음. 공통 변환 사전으로 대부분 커버되지만, 특수 케이스(진행률 바, 드랍존, prose 등)는 각 태스크의 "특수 처리" 목록을 우선 참고.
