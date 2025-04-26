import type { Page } from "@playwright/test";

export class BrowsePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.getByTestId("nav-browse").click();
  }

  async getStatistics() {
    return {
      aiUnedited: await this.page.getByTestId("stat-count-ai-unedited").textContent(),
      aiEdited: await this.page.getByTestId("stat-count-ai-edited").textContent(),
      manual: await this.page.getByTestId("stat-count-manual").textContent(),
      aiRejected: await this.page.getByTestId("stat-count-ai-rejected").textContent(),
    };
  }

  async getFlashcards() {
    return this.page.getByTestId("flashcard-item").all();
  }

  async getNoFlashcardsMessage() {
    return this.page.getByTestId("no-flashcards-message");
  }

  async filterByAiEdited() {
    await this.page.getByTestId("filter-button-ai_edited").click();
  }
}
