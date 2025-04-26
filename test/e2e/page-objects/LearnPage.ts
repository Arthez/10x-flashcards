import type { Page } from "@playwright/test";

export class LearnPage {
  constructor(private page: Page) {}

  async getCreateFlashcardButton() {
    return this.page.getByTestId("create-flashcard-button");
  }

  async getFlashcards() {
    return this.page.getByTestId("flashcard-item").all();
  }
}
