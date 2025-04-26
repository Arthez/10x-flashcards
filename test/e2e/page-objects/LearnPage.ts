import type { Page } from "@playwright/test";

export class LearnPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.getByTestId("nav-learn").click();
  }

  async getCreateFlashcardButton() {
    return this.page.getByTestId("create-flashcards-button");
  }

  async getFlashcards() {
    return this.page.getByTestId("flashcard-display").all();
  }
}
