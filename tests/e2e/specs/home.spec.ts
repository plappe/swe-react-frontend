/**
 * E2E Tests: Home Page
 *
 * Testet die grundlegende Funktionalität der Startseite.
 */

import { test, expect } from '../fixtures';

test.describe('Home Page', () => {
  /**
   * Test: Startseite wird korrekt angezeigt
   */
  test('sollte Willkommensnachricht anzeigen', async ({ homePage }) => {
    await homePage.goto();

    // Prüfe dass die Überschrift sichtbar ist
    await expect(homePage.heading).toBeVisible();
  });

  /**
   * Test: Navigation zur Suchseite funktioniert
   */
  test('sollte zur Suchseite navigieren', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.goToSearch();

    // Prüfe URL
    await expect(page).toHaveURL(/\/suche/);
  });

  /**
   * Test: Login-Link ist sichtbar für nicht angemeldete Benutzer
   */
  test('sollte Login-Link anzeigen', async ({ homePage }) => {
    await homePage.goto();

    await expect(homePage.loginButton).toBeVisible();
  });
});
