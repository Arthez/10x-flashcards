import type { Page } from "@playwright/test";

export class BrowsePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.getByTestId("browse-nav-link").click();
  }

  async getStatistics() {
    return {
      aiUnedited: await this.page.getByTestId("ai-unedited-count").textContent(),
      aiEdited: await this.page.getByTestId("ai-edited-count").textContent(),
      manual: await this.page.getByTestId("manual-count").textContent(),
      aiRejected: await this.page.getByTestId("ai-rejected-count").textContent(),
    };
  }

  async getFlashcards() {
    return this.page.getByTestId("flashcard-item").all();
  }

  async getNoFlashcardsMessage() {
    return this.page.getByTestId("no-flashcards-message");
  }

  async filterByAiEdited() {
    await this.page.getByTestId("ai-edited-filter").click();
  }
}
