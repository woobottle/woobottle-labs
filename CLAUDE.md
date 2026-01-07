# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production (static export)
pnpm start            # Serve static output
pnpm lint             # Run ESLint
pnpm test             # Run Jest tests
pnpm test:watch       # Run tests in watch mode
pnpm test -- --testPathPattern="timer"  # Run specific test file
pnpm ship             # Auto-commit and deploy script
```

## Architecture: Feature-Sliced Design (FSD)

This is a Next.js 15 App Router project using FSD architecture. The codebase is a collection of web utilities (icon generator, timer, currency converter, etc.).

### Layer Hierarchy (top to bottom)

```
src/
├── app/               # Next.js App Router - routing only, delegates to components/pages
├── components/pages/  # Page components (separated from app/ to avoid Next.js conflicts)
├── widgets/           # Composite UI blocks (app-layout, sidebar, landing-layout)
├── features/          # Business features (icon-generation, pomodoro-timer, currency-conversion)
├── entities/          # Domain models (icon, timer, currency, text, area, name)
├── shared/            # Reusable code (ui/, lib/, types/)
```

### Import Rules

- **Allowed**: Upper layers can import from lower layers
- **Forbidden**: Lower layers cannot import from upper layers
- **Forbidden**: Same-layer cross-imports (use shared/ instead)

Example: `features/` can import from `entities/` and `shared/`, but not from `widgets/` or `components/pages/`

### Path Aliases

```typescript
@/*         → ./src/*
features/*  → ./src/features/*
entities/*  → ./src/entities/*
shared/*    → ./src/shared/*
widgets/*   → ./src/widgets/*
pages/*     → ./src/components/pages/*
```

### Module Structure

Each feature/entity follows this pattern:
```
feature-name/
├── ui/           # React components
├── model/        # State management, types, hooks (use-*.ts)
├── lib/          # Pure functions, utilities
└── index.ts      # Public API exports
```

### Naming Conventions

- **Folders/Files**: kebab-case (`icon-generator`, `text-analyzer.tsx`)
- **Components**: PascalCase with semantic suffix (`TextCounterPage`, `SidebarWidget`)
- **Hooks**: `use-*.ts` pattern (`use-pomodoro-timer.ts`)

## Key Technologies

- **Next.js 15** with App Router and Turbopack
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS** with `tailwind-merge` and `clsx`
- **Jest** with React Testing Library
- **Static export** for S3 deployment (`output: 'export'`)
