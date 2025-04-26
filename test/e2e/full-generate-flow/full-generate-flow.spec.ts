import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import { LoginPage } from "../page-objects/LoginPage";
import { LearnPage } from "../page-objects/LearnPage";
import { BrowsePage } from "../page-objects/BrowsePage";
import { GeneratePage } from "../page-objects/GeneratePage";
import { TopNavigation } from "../page-objects/TopNavigation";
import { createClient } from "@supabase/supabase-js";

// Load test environment variables
dotenv.config({ path: ".env.test" });

test.describe.serial("Full Generate Flow", () => {
  let loginPage: LoginPage;
  let learnPage: LearnPage;
  let browsePage: BrowsePage;
  let generatePage: GeneratePage;
  let topNav: TopNavigation;

  const TEST_USER = {
    email: process.env.E2E_USERNAME as string,
    password: process.env.E2E_PASSWORD as string,
  };

  const SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL as string,
    publicKey: process.env.SUPABASE_KEY as string,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  };

  let userId: string;

  test.beforeAll(async () => {
    if (!TEST_USER.email || !TEST_USER.password) {
      throw new Error("E2E_USERNAME and E2E_PASSWORD must be set in .env.test file");
    }

    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.publicKey || !SUPABASE_CONFIG.serviceRoleKey) {
      throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and SUPABASE_KEY must be set in .env.test file");
    }

    // Create Supabase client with public key for signup
    const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.publicKey);

    // Create test user
    const { data, error } = await supabase.auth.signUp({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    if (error) {
      console.error("Failed to create test user:", error.message);
      throw error;
    }

    if (!data.user?.id) {
      throw new Error("Failed to get user ID after creation");
    }

    userId = data.user.id;
  });

  test.afterAll(async () => {
    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.serviceRoleKey);

    // Delete user directly using admin API
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Failed to delete test user:", error.message);
      throw error;
    }
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    learnPage = new LearnPage(page);
    browsePage = new BrowsePage(page);
    generatePage = new GeneratePage(page);
    topNav = new TopNavigation(page);
  });

  test("1. should login successfully", async ({ page }) => {
    await loginPage.goto();
    await expect(page).toHaveURL("/auth/login");

    await loginPage.login(TEST_USER.email, TEST_USER.password);
    await expect(page).toHaveURL("/learn");

    // 2. should check learn page
    const createFlashcardButton = await learnPage.getCreateFlashcardButton();
    await expect(createFlashcardButton).toBeVisible();
    const initialFlashcards = await learnPage.getFlashcards();
    expect(initialFlashcards).toHaveLength(0);

    // 3-4. should check browse page initial state
    await browsePage.goto();
    await expect(page).toHaveURL("/browse");
    const initialStats = await browsePage.getStatistics();
    expect(initialStats.aiUnedited).toBe("0");
    expect(initialStats.aiEdited).toBe("0");
    expect(initialStats.manual).toBe("0");
    expect(initialStats.aiRejected).toBe("0");

    const noFlashcardsMessage = await browsePage.getNoFlashcardsMessage();
    await expect(noFlashcardsMessage).toHaveText("No flashcards found. Create your first flashcard to get started!");

    // 5-6. should check generate page heading
    await generatePage.goto();
    await expect(page).toHaveURL("/generate");
    const heading = await generatePage.getHeading();
    await expect(heading).toHaveText("Generate Flashcards");

    // 7-8. should check generate button state with short text
    await generatePage.setInputText("some text");
    const generateButton1 = await generatePage.getGenerateButton();
    await expect(generateButton1).toBeDisabled();

    // 9-11. should generate flashcards with proper text
    const tigerText = `Tygrys azjatycki, tygrys (Panthera tigris) – gatunek dużego, drapieżnego ssaka łożyskowego z podrodziny panter (Pantherinae) w rodzinie kotowatych (Felidae), największego ze współczesnych[a] pięciu gatunków dzikich kotów z rodzaju Panthera, jeden z największych drapieżników lądowych (wielkością ustępuje jedynie niektórym niedźwiedziom). Dorosłe samce osiągają ponad 300 kg masy ciała przy ponad 3 m całkowitej długości. Rekordowa masa ciała samca, z podgatunku tygrysa syberyjskiego, wynosi 423 kg. Dobrze skacze, bardzo dobrze pływa, poluje zwykle samotnie. Dawniej liczny w całej Azji, zawsze budzący grozę, stał się obiektem polowań dla sportu, pieniędzy lub prewencyjnej obrony (ludzi i zwierząt hodowlanych). Wytępiony w wielu regionach, zagrożony wyginięciem, został objęty programami ochrony. Największa dzika populacja żyje w Indiach (gdzie w niektórych regionach tygrysy są uważane za zwierzęta święte). Słowo "tygrys" pochodzi od greckiego wyrazu tigris, które z kolei ma najprawdopodobniej irańskie korzenie.`;
    await generatePage.setInputText(tigerText);
    const generateButton2 = await generatePage.getGenerateButton();
    await generateButton2.click();

    // Wait for flashcard proposals
    const proposals = await generatePage.waitForFlashcardProposals();
    expect(proposals).toHaveLength(5);

    // 12. should edit and process flashcards
    await generatePage.editFlashcardFront(0, "EDITED");
    await generatePage.acceptFlashcard(0);
    await generatePage.acceptFlashcard(1);
    await generatePage.acceptFlashcard(2);
    await generatePage.rejectFlashcard(3);

    // 13-15. should check browse page statistics and flashcards
    await browsePage.goto();
    await expect(page).toHaveURL("/browse");
    const finalStats = await browsePage.getStatistics();
    expect(finalStats.aiUnedited).toBe("2");
    expect(finalStats.aiEdited).toBe("1");
    expect(finalStats.manual).toBe("0");
    expect(finalStats.aiRejected).toBe("2");

    const finalFlashcards = await browsePage.getFlashcards();
    expect(finalFlashcards).toHaveLength(3);

    // 16. should filter by AI edited
    await browsePage.filterByAiEdited();
    const editedFlashcards = await browsePage.getFlashcards();
    expect(editedFlashcards).toHaveLength(1);

    // 17-18. should logout and check login page", async ({ page }) => {
    await topNav.logout();
    await expect(page).toHaveURL("/auth/login");
  });
});
