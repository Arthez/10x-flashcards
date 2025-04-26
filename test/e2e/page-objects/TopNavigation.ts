import type { Page } from "@playwright/test";

export class TopNavigation {
  constructor(private page: Page) {}

  async logout() {
    await this.page.getByTestId("logout-button").click();
  }
}
