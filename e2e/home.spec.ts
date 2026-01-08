import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify page loaded
    await expect(page).toHaveTitle(/woobottle/i);
  });

  test("should not have critical console errors", async ({ page }) => {
    const errors: string[] = [];
    const ignoredPatterns = [
      /404/, // Resource not found
      /Failed to load resource/,
      /MIME type/,
    ];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        const isIgnored = ignoredPatterns.some((pattern) => pattern.test(text));
        if (!isIgnored) {
          errors.push(text);
        }
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });

  test("should navigate to tool pages", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find and click first tool link
    const toolLinks = page.locator('a[href^="/"]').first();
    if (await toolLinks.isVisible()) {
      const href = await toolLinks.getAttribute("href");
      await toolLinks.click();
      await page.waitForLoadState("networkidle");

      if (href) {
        await expect(page).toHaveURL(new RegExp(href));
      }
    }
  });
});
