# Testing in 10x-Flashcards

This project uses a comprehensive testing strategy with both unit tests and end-to-end (E2E) tests.

## Test Structure

- **Unit Tests**: Located in `test/unit/`
- **E2E Tests**: Located in `test/e2e/`
- **Test Reports**: Generated in `test/reports/`

## Unit Testing with Vitest

We use Vitest for fast and efficient unit tests, particularly for testing React components and utility functions.

### Running Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode for development
npm run test:watch

# Run tests with UI for better visualization
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Reports

Unit test reports are generated in:
- HTML reports: `test/reports/unit/html/`
- JSON reports: `test/reports/unit/json/`
- Coverage reports: `test/reports/coverage/`

### Writing Unit Tests

Unit tests should be placed in the `test/unit` directory with the naming convention `*.test.ts` or `*.test.tsx` for React components.

Example structure:
```typescript
// test/unit/components/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../src/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

## E2E Testing with Playwright

We use Playwright for end-to-end testing, focusing specifically on Chromium/Desktop Chrome as our target browser.

### Running E2E Tests

```bash
# Run all E2E tests (automatically starts dev server)
npm run test:e2e

# Run E2E tests with UI (automatically starts dev server)
npm run test:e2e:ui

# If you encounter timeout issues with the automatic server startup:
# 1. Start the dev server manually in one terminal
npm run dev

# 2. Run tests in another terminal using the manual config
npm run test:e2e:manual
```

### Test Reports

E2E test reports are generated in:
- Automatic tests: `test/reports/e2e/`

### Troubleshooting E2E Tests

If you encounter a timeout error when running E2E tests, it means the dev server isn't starting properly or Playwright can't detect when it's ready. Try these solutions:

1. Use the manual testing approach (start server first, then run tests separately)
2. Increase the timeout in playwright.config.ts if needed
3. Ensure the server is binding to the correct port (3000)

### Writing E2E Tests

E2E tests should be placed in the `test/e2e` directory with the naming convention `*.spec.ts`.

We use the Page Object Model (POM) pattern for maintainable tests:

```typescript
// test/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async getTitle() {
    return this.page.title();
  }
}

test.describe('Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('has correct title', async () => {
    const title = await homePage.getTitle();
    expect(title).toContain('10x Flashcards');
  });
});
```

### Visual Testing

Visual testing can be done using Playwright's screenshot comparison:

```typescript
test('visual comparison', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## Best Practices

1. **Use Test Doubles**: Leverage Vitest's mocking capabilities for isolating components
2. **Test Edge Cases**: Include error scenarios and boundary conditions in your tests
3. **Isolate Test Environments**: Use browser contexts in Playwright tests for isolation
4. **Use Descriptive Names**: Name your tests clearly to explain what they're verifying
5. **Leverage Test Hooks**: Use setup and teardown hooks for common test operations 
