/**
 * Playwright Fixtures
 *
 * Fixtures sind wiederverwendbare Setup/Teardown-Logik.
 * Sie werden vor jedem Test ausgeführt und bieten
 * vorbereitete Objekte für die Tests.
 *
 * Dokumentation: https://playwright.dev/docs/test-fixtures
 */

import { test as base } from '@playwright/test';
import { HomePage, LoginPage, SearchPage, CreateBookPage } from './pages';

/**
 * Typ-Definition für unsere Fixtures
 */
interface Fixtures {
  homePage: HomePage;
  loginPage: LoginPage;
  searchPage: SearchPage;
  createBookPage: CreateBookPage;
}

/**
 * Erweiterte Test-Funktion mit Fixtures
 *
 * Verwendung in Tests:
 * test('mein test', async ({ homePage }) => {
 *   await homePage.goto();
 * });
 */
export const test = base.extend<Fixtures>({
    /** HomePage Fixture */
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    /** LoginPage Fixture */
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

  /** SearchPage Fixture */
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchPage(page);
    await use(searchPage);
  },

  // Create Book Page Fixture
  createBookPage: async ({ page }, use) => {
    const createBookPage = new CreateBookPage(page);
    await use(createBookPage);
  },
});

// Re-export expect für konsistente Imports
export { expect } from '@playwright/test';
