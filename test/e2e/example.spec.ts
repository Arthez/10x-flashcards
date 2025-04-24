import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// Example of Page Object Model (POM) implementation
class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/auth/login");
  }

  async getTitle() {
    return this.page.title();
  }

  async getHeading() {
    return this.page.locator("h1").textContent();
  }

  // Add more methods as needed
}

test.describe("Homepage", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("has correct title", async () => {
    // Replace with actual expected title
    const title = await homePage.getTitle();
    expect(title).toContain("10x Flashcards - Authentication");
  });

  test("has welcome message", async () => {
    // Replace with actual expected heading content
    const heading = await homePage.getHeading();
    expect(heading).toContain("Welcome back");
  });

  // test("takes screenshot", async ({ page }) => {
  //   // Visual comparison test
  //   await expect(page).toHaveScreenshot("homepage.png");
  // });
});
