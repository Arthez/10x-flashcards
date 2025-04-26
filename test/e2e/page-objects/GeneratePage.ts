import type { Page } from "@playwright/test";

export class GeneratePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.getByTestId("nav-generate").click();
  }

  async getHeading() {
    return this.page.getByRole("heading", { level: 1 });
  }

  async setInputText(text: string) {
    await this.page.getByTestId("generate-input-textarea").fill(text);
  }

  async getGenerateButton() {
    return this.page.getByTestId("generate-button");
  }

  async waitForFlashcardProposals() {
    await this.page.waitForSelector('[data-testid="card"]', { state: "visible" });
    return this.page.getByTestId("card").all();
  }

  async editFlashcardFront(index: number, additionalText: string) {
    const flashcard = (await this.page.getByTestId("card").all())[index];
    const frontContent = await flashcard.getByTestId("flashcard-front-input");
    const currentText = await frontContent.inputValue();
    await frontContent.fill(currentText + additionalText);
  }

  async acceptFlashcard(index: number) {
    const flashcard = (await this.page.getByTestId("card").all())[index];
    await flashcard.getByTestId("flashcard-accept").click();
  }

  async rejectFlashcard(index: number) {
    const flashcard = (await this.page.getByTestId("card").all())[index];
    await flashcard.getByTestId("flashcard-reject").click();
  }
}
