/**
 * E2E Tests: Buch-Erstellung (nur für Admins)
 *
 * Tests für das Erstellen neuer Bücher - erfordert Admin-Authentifizierung.
 */

import { test, expect } from '../fixtures';

test.describe('Create Book Page', () => {
  test('should redirect non-admin users to home', async ({ page, createBookPage }) => {
    await createBookPage.goto();

    /** Sollte zur Startseite umleiten */
    await page.waitForURL('/', { timeout: 5000 });
  });

  /** Admin-Tests werden übersprungen, da keine Auth konfiguriert ist */
  test.skip('should display create book form for admin', async ({ createBookPage }) => {
    await createBookPage.goto();

    await expect(createBookPage.heading).toBeVisible();
    await expect(createBookPage.isbnInput).toBeVisible();
    await expect(createBookPage.titelInput).toBeVisible();
    await expect(createBookPage.submitButton).toBeVisible();
  });

  test.skip('should validate required fields', async ({ createBookPage }) => {
    await createBookPage.goto();

    await createBookPage.isbnInput.click();
    await createBookPage.titelInput.click();

    /** Sollte Validierungsfehler anzeigen */
    await expect(createBookPage.isbnInput).toHaveClass(/is-invalid/);

    await createBookPage.titelInput.click();
    await createBookPage.preisInput.click();

    await expect(createBookPage.titelInput).toHaveClass(/is-invalid/);

    // Leave Preis empty and blur
    await createBookPage.preisInput.click();
    await createBookPage.isbnInput.click();

    // Should show validation error
    await expect(createBookPage.preisInput).toHaveClass(/is-invalid/);
  });

  test.skip('should validate ISBN format', async ({ createBookPage }) => {
    // TODO: Set up admin authentication
    await createBookPage.goto();

    // Enter invalid ISBN
    await createBookPage.isbnInput.fill('123');
    await createBookPage.titelInput.click(); // Trigger blur

    // Should show validation error
    await expect(createBookPage.isbnInput).toHaveClass(/is-invalid/);
    await expect(
      createBookPage.page.locator('text=/isbn.*gültig/i')
    ).toBeVisible();
  });

  test.skip('should validate homepage URL format', async ({ createBookPage }) => {
    // TODO: Set up admin authentication
    await createBookPage.goto();

    // Enter invalid URL
    await createBookPage.homepageInput.fill('not-a-url');
    await createBookPage.isbnInput.click(); // Trigger blur

    // Should show validation error
    await expect(createBookPage.homepageInput).toHaveClass(/is-invalid/);
  });

  test.skip('should require book type selection', async ({ createBookPage }) => {
    // TODO: Set up admin authentication
    await createBookPage.goto();

    // Art should start with "Auswählen..."
    await expect(createBookPage.artSelect).toHaveValue('');

    // Blur without selecting
    await createBookPage.artSelect.click();
    await createBookPage.isbnInput.click();

    // Should show validation error when trying to submit
    await createBookPage.submitButton.click();

    await expect(createBookPage.artSelect).toHaveClass(/is-invalid/);
  });

  test.skip('should create book with valid data', async ({ createBookPage }) => {
    // TODO: Set up admin authentication
    await createBookPage.goto();

    // Fill form with valid data
    await createBookPage.createBook({
      isbn: '978-3-16-148410-0',
      titel: 'Test Book E2E',
      art: 'PAPERBACK',
      preis: '29.99',
      rating: '4',
      homepage: 'https://example.com',
    });

    // Wait for response
    await createBookPage.page.waitForTimeout(2000);

    // Should show success message
    await expect(createBookPage.successAlert).toBeVisible();
    await expect(createBookPage.page.locator('text=/erfolg/i')).toBeVisible();

    // Form should be reset
    await expect(createBookPage.isbnInput).toHaveValue('');
    await expect(createBookPage.titelInput).toHaveValue('');
  });

  test.skip('should handle duplicate ISBN error', async ({ createBookPage }) => {
    // TODO: Set up admin authentication
    await createBookPage.goto();

    // Try to create book with existing ISBN
    await createBookPage.createBook({
      isbn: '978-0-007-00644-1', // Existing ISBN
      titel: 'Duplicate Test',
      art: 'HARDCOVER',
      preis: '19.99',
    });

    // Wait for response
    await createBookPage.page.waitForTimeout(2000);

    // Should show error about duplicate ISBN
    await expect(createBookPage.errorAlert).toBeVisible();
    await expect(
      createBookPage.page.locator('text=/isbn.*existiert bereits/i')
    ).toBeVisible();
  });

  test.skip('should cancel and return to home', async ({ page, createBookPage }) => {
    // TODO: Set up admin authentication
    await createBookPage.goto();

    // Fill some data
    await createBookPage.isbnInput.fill('123');

    // Click cancel
    await createBookPage.cancelButton.click();

    // Should navigate to home
    await page.waitForURL('/', { timeout: 5000 });
  });
});
