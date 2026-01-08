---
name: webapp-testing
description: Guides writing and running tests for React components and E2E tests. Use when writing unit tests, integration tests, E2E tests, or when the user asks to test a component.
---

# Web Application Testing Skill

This skill provides guidance for testing in this Next.js project:
- **Unit/Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright

## When to Use

- Writing unit tests for React components
- Testing hooks and custom logic
- Verifying UI behavior and user interactions
- Debugging failing tests

## Testing Approach Decision Tree

```
Is this a pure function or utility?
├─ Yes → Write unit test with Jest only
└─ No → Is this a React component?
    ├─ Yes → Use React Testing Library
    │   ├─ Does it have user interactions? → Use userEvent
    │   ├─ Does it fetch data? → Mock fetch/API calls
    │   └─ Does it use context? → Wrap with providers
    └─ No → Is this a custom hook?
        └─ Yes → Use @testing-library/react's renderHook
```

## Test File Structure

Follow the FSD architecture pattern:
```
feature-name/
├── ui/
│   ├── component.tsx
│   └── component.test.tsx    # Co-locate tests with components
├── model/
│   ├── use-hook.ts
│   └── use-hook.test.ts
└── lib/
    ├── utils.ts
    └── utils.test.ts
```

## Essential Patterns

### 1. Component Testing
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from './component-name'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    const onClickMock = jest.fn()

    render(<ComponentName onClick={onClickMock} />)
    await user.click(screen.getByRole('button'))

    expect(onClickMock).toHaveBeenCalledTimes(1)
  })
})
```

### 2. Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react'
import { useCustomHook } from './use-custom-hook'

describe('useCustomHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook())
    expect(result.current.value).toBe(initialValue)
  })

  it('updates state correctly', () => {
    const { result } = renderHook(() => useCustomHook())
    act(() => {
      result.current.setValue('new value')
    })
    expect(result.current.value).toBe('new value')
  })
})
```

### 3. Async Testing
```typescript
it('loads data asynchronously', async () => {
  render(<AsyncComponent />)

  // Wait for loading to complete
  expect(await screen.findByText('Loaded Content')).toBeInTheDocument()
})
```

## Query Priority (Best to Worst)

1. **getByRole** - Accessible to everyone (preferred)
2. **getByLabelText** - Form fields
3. **getByPlaceholderText** - When label is not available
4. **getByText** - Non-interactive elements
5. **getByTestId** - Last resort only

## Commands

```bash
pnpm test                                    # Run all tests
pnpm test:watch                              # Watch mode
pnpm test -- --testPathPattern="timer"       # Specific file
pnpm test -- --coverage                      # With coverage
```

## Common Gotchas

1. **Always use `await` with userEvent** - It's async in v14+
2. **Use `findBy*` for async content** - Not `getBy*` with waitFor
3. **Wrap state updates in `act()`** - When testing hooks directly
4. **Mock Next.js router** - Use `jest.mock('next/navigation')`
5. **Reset mocks between tests** - Use `beforeEach(() => jest.clearAllMocks())`

## Mocking Patterns

### Next.js Navigation
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/current-path',
}))
```

### localStorage
```typescript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })
```

---

# E2E Testing with Playwright

## Setup

```bash
# Install Playwright
pnpm add -D @playwright/test

# Install browsers
npx playwright install
```

Add to `package.json`:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

## Configuration

Create `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## E2E Test Structure

```
e2e/
├── home.spec.ts           # Homepage tests
├── tool-navigation.spec.ts # Tool page navigation
├── fixtures/
│   └── test-fixtures.ts   # Custom fixtures
└── utils/
    └── helpers.ts         # Shared helpers
```

## E2E Testing Patterns

### Basic Navigation Test
```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display tool list', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /tools/i })).toBeVisible()
  })

  test('should navigate to tool page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Icon Generator')
    await expect(page).toHaveURL(/\/icon-generator/)
  })
})
```

### Form Interaction
```typescript
test('should generate icon with custom settings', async ({ page }) => {
  await page.goto('/icon-generator')

  // Fill form
  await page.fill('[name="text"]', 'AB')
  await page.selectOption('[name="size"]', '128')
  await page.click('text=Generate')

  // Verify result
  await expect(page.locator('.icon-preview')).toBeVisible()
})
```

### Screenshot Testing
```typescript
test('should match visual snapshot', async ({ page }) => {
  await page.goto('/icon-generator')
  await expect(page).toHaveScreenshot('icon-generator.png')
})
```

### Testing with Server (from anthropic/skills pattern)
```typescript
import { test, expect } from '@playwright/test'

test('should interact with running app', async ({ page }) => {
  // Navigate and wait for full load
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Discover elements
  const buttons = await page.locator('button').all()
  console.log(`Found ${buttons.length} buttons`)

  // Take screenshot for debugging
  await page.screenshot({ path: 'test-results/debug.png', fullPage: true })
})
```

### Console Log Capture
```typescript
test('should not have console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  expect(errors).toHaveLength(0)
})
```

## E2E Commands

```bash
pnpm test:e2e                    # Run all E2E tests
pnpm test:e2e:ui                 # Interactive UI mode
pnpm test:e2e:headed             # See browser
pnpm test:e2e -- --grep "home"   # Filter by test name
pnpm test:e2e -- --project=chromium  # Specific browser
npx playwright show-report       # View HTML report
```

## E2E Best Practices

1. **Wait for networkidle** before DOM inspection for dynamic content
2. **Use locators over selectors** - `page.getByRole()`, `page.getByText()`
3. **Avoid hard-coded waits** - Use `waitForSelector()` or `expect().toBeVisible()`
4. **Test user flows, not implementation** - Click buttons, fill forms, verify outcomes
5. **Use baseURL** - Keep tests portable across environments
6. **Screenshot on failure** - Helps debug CI failures
