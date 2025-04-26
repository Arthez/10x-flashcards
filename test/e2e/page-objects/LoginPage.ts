import type { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/auth/login");
  }

  async login(email: string, password: string) {
    await this.page.getByTestId("email-input").fill(email);
    await this.page.getByTestId("password-input").fill(password);
    await this.page.getByTestId("login-button").click();
  }
}
