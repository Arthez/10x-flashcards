import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { LoginPage } from "../page-objects/LoginPage";
import { LearnPage } from "../page-objects/LearnPage";
import { BrowsePage } from "../page-objects/BrowsePage";
import { GeneratePage } from "../page-objects/GeneratePage";
import { TopNavigation } from "../page-objects/TopNavigation";

// Load test environment variables
dotenv.config({ path: ".env.test" });

test.describe.serial("Full Generate Flow", () => {
  let loginPage: LoginPage;
  let learnPage: LearnPage;
  let browsePage: BrowsePage;
  let generatePage: GeneratePage;
  let topNav: TopNavigation;

  test.beforeAll(async ({ page }) => {
    loginPage = new LoginPage(page);
    learnPage = new LearnPage(page);
    browsePage = new BrowsePage(page);
    generatePage = new GeneratePage(page);
    topNav = new TopNavigation(page);
  });

  test("1. should login successfully", async ({ page }) => {
    await loginPage.goto();
    await expect(page).toHaveURL("/auth/login");
    const email = process.env.E2E_USERNAME;
    const password = process.env.E2E_PASSWORD;

    if (!email || !password) {
      throw new Error("E2E_USERNAME and E2E_PASSWORD must be set in .env.test file");
    }

    await loginPage.login(email, password);
    await expect(page).toHaveURL("/learn");
  });

  test("2. should check learn page", async () => {
    const createFlashcardButton = await learnPage.getCreateFlashcardButton();
    await expect(createFlashcardButton).toBeVisible();
    const initialFlashcards = await learnPage.getFlashcards();
    expect(initialFlashcards).toHaveLength(0);
  });

  test("3-4. should check browse page initial state", async ({ page }) => {
    await browsePage.goto();
    await expect(page).toHaveURL("/browse");
    const initialStats = await browsePage.getStatistics();
    expect(initialStats.aiUnedited).toBe("0");
    expect(initialStats.aiEdited).toBe("0");
    expect(initialStats.manual).toBe("0");
    expect(initialStats.aiRejected).toBe("0");

    const noFlashcardsMessage = await browsePage.getNoFlashcardsMessage();
    await expect(noFlashcardsMessage).toHaveText("No flashcards found. Create your first flashcard to get started!");
  });

  test("5-6. should check generate page heading", async ({ page }) => {
    await generatePage.goto();
    await expect(page).toHaveURL("/generate");
    const heading = await generatePage.getHeading();
    await expect(heading).toHaveText("Generate Flashcards");
  });

  test("7-8. should check generate button state with short text", async () => {
    await generatePage.setInputText("some text");
    const generateButton = await generatePage.getGenerateButton();
    await expect(generateButton).toBeDisabled();
  });

  test("9-11. should generate flashcards with proper text", async () => {
    const tigerText = `Tygrys azjatycki, tygrys (Panthera tigris) – gatunek dużego, drapieżnego ssaka łożyskowego z podrodziny panter (Pantherinae) w rodzinie kotowatych (Felidae), największego ze współczesnych[a] pięciu gatunków dzikich kotów z rodzaju Panthera, jeden z największych drapieżników lądowych (wielkością ustępuje jedynie niektórym niedźwiedziom). Dorosłe samce osiągają ponad 300 kg masy ciała przy ponad 3 m całkowitej długości. Rekordowa masa ciała samca, z podgatunku tygrysa syberyjskiego, wynosi 423 kg. Dobrze skacze, bardzo dobrze pływa, poluje zwykle samotnie. Dawniej liczny w całej Azji, zawsze budzący grozę, stał się obiektem polowań dla sportu, pieniędzy lub prewencyjnej obrony (ludzi i zwierząt hodowlanych). Wytępiony w wielu regionach, zagrożony wyginięciem, został objęty programami ochrony. Największa dzika populacja żyje w Indiach (gdzie w niektórych regionach tygrysy są uważane za zwierzęta święte). Słowo "tygrys" pochodzi od greckiego wyrazu tigris, które z kolei ma najprawdopodobniej irańskie korzenie.`;
    await generatePage.setInputText(tigerText);
    const generateButton = await generatePage.getGenerateButton();
    await generateButton.click();

    // Wait for flashcard proposals
    const proposals = await generatePage.waitForFlashcardProposals();
    expect(proposals).toHaveLength(5);
  });

  test("12. should edit and process flashcards", async () => {
    await generatePage.editFlashcardFront(0, "EDITED");
    await generatePage.acceptFlashcard(0);
    await generatePage.acceptFlashcard(1);
    await generatePage.acceptFlashcard(2);
    await generatePage.rejectFlashcard(3);
  });

  test("13-15. should check browse page statistics and flashcards", async ({ page }) => {
    await browsePage.goto();
    await expect(page).toHaveURL("/browse");
    const finalStats = await browsePage.getStatistics();
    expect(finalStats.aiUnedited).toBe("2");
    expect(finalStats.aiEdited).toBe("1");
    expect(finalStats.manual).toBe("0");
    expect(finalStats.aiRejected).toBe("2");

    const finalFlashcards = await browsePage.getFlashcards();
    expect(finalFlashcards).toHaveLength(3);
  });

  test("16. should filter by AI edited", async () => {
    await browsePage.filterByAiEdited();
    const editedFlashcards = await browsePage.getFlashcards();
    expect(editedFlashcards).toHaveLength(1);
  });

  test("17-18. should logout and check login page", async ({ page }) => {
    await topNav.logout();
    await expect(page).toHaveURL("/auth/login");
  });
});
