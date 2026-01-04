/**
 * E2E Tests: Navigation
 *
 * Testet das Routing und die Navigation zwischen Seiten.
 */

import { test, expect } from '../fixtures';

test.describe('Navigation', () => {
    /**
     * Test: Header ist auf allen Seiten sichtbar
     */
    test('sollte Header auf allen Seiten anzeigen', async ({ page }) => {
        const header = page.getByRole('navigation');

        // Startseite
        await page.goto('/');
        await expect(header).toBeVisible();

        // Suchseite
        await page.goto('/suche');
        await expect(header).toBeVisible();

        // Login-Seite
        await page.goto('/login');
        await expect(header).toBeVisible();
    });

    /**
     * Test: 404-Seite für unbekannte URLs
     */
    test('sollte 404-Seite für unbekannte URLs anzeigen', async ({ page }) => {
        await page.goto('/diese-seite-existiert-nicht');

        // Prüfe dass 404 angezeigt wird
        await expect(page.getByText('404')).toBeVisible();
        await expect(page.getByText(/seite nicht gefunden/i)).toBeVisible();
    });

    /**
     * Test: "Zur Startseite" Link auf 404-Seite funktioniert
     */
    test('sollte von 404 zur Startseite navigieren', async ({ page }) => {
        await page.goto('/unbekannte-seite');

        const homeLink = page.getByRole('link', { name: /zur startseite/i });
        await homeLink.click();

        await expect(page).toHaveURL('/');
    });
});
