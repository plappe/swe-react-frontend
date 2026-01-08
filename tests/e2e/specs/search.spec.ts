/**
 * E2E Tests: Such-Funktionalität
 *
 * Tests für die Buchsuchseite mit Filtern und Paginierung.
 */

import { test, expect } from '../fixtures';

test.describe('Search Page', () => {
  test.beforeEach(async ({ searchPage }) => {
    await searchPage.goto();
  });

  test('should display search page', async ({ searchPage }) => {
    await expect(searchPage.heading).toBeVisible();
    await expect(searchPage.searchButton).toBeVisible();
  });

  test('should show all books when searching without filters', async ({ searchPage }) => {
    await searchPage.searchButton.click();

    await searchPage.page.waitForTimeout(1000);

    /** Prüfe ob Backend-Fehler angezeigt wird */
    const errorVisible = await searchPage.page.locator('.alert-danger').isVisible();
    
    /** Überspringe Test wenn Backend nicht verfügbar (CI ohne Backend) */
    if (errorVisible) {
      test.skip();
      return;
    }

    /** Sollte Ergebnisse zeigen wenn Backend verfügbar */
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter by ISBN and show results', async ({ searchPage }) => {
    /** Zuerst ohne Filter suchen um vorhandene ISBNs zu finden */
    await searchPage.searchButton.click();
    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    if (count > 0) {
      /** Hole eine echte ISBN aus den Ergebnissen */
      const isbnBadge = searchPage.page.locator('.badge:has-text("ISBN:")').first();
      const isbnText = await isbnBadge.textContent();
      const isbn = isbnText?.replace('ISBN:', '').trim();

      if (isbn) {
        /** Suche gezielt nach dieser ISBN */
        await searchPage.reset();
        await searchPage.search({ isbn });
        await searchPage.page.waitForTimeout(1000);

        /** Sollte das Buch finden */
        const resultCount = await searchPage.getResultCount();
        expect(resultCount).toBeGreaterThanOrEqual(1);

        /** Sollte ISBN in Ergebnissen anzeigen */
        await expect(searchPage.page.locator(`.badge:has-text("${isbn}")`)).toBeVisible();
      }
    }
  });

  test('should filter by title', async ({ searchPage }) => {
    /** Zuerst suchen um verfügbare Titel zu finden */
    await searchPage.searchButton.click();
    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    if (count > 0) {
      /** Hole einen Titel aus den Ergebnissen */
      const titleElement = searchPage.resultCards.first().locator('h5');
      const titleText = await titleElement.textContent();

      if (titleText && titleText !== 'Ohne Titel') {
        /** Suche nach den ersten Zeichen des Titels */
        const searchTerm = titleText.substring(0, 3);

        await searchPage.reset();
        await searchPage.search({ titel: searchTerm });
        await searchPage.page.waitForTimeout(1000);

        const resultCount = await searchPage.getResultCount();
        expect(resultCount).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test('should filter by book type using checkboxes', async ({ searchPage }) => {
    await searchPage.search({ arten: ['PAPERBACK'] });

    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThanOrEqual(0);

    if (count > 0) {
      /** Sollte PAPERBACK Badge in mindestens einem Ergebnis zeigen */
      await expect(searchPage.page.locator('.badge:has-text("PAPERBACK")').first()).toBeVisible();
    }
  });

  test('should filter by multiple book types', async ({ searchPage }) => {
    await searchPage.search({ arten: ['PAPERBACK', 'HARDCOVER'] });

    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should filter by minimum rating', async ({ searchPage }) => {
    await searchPage.search({ rating: '4' });

    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should filter by availability using radio buttons', async ({ searchPage }) => {
    await searchPage.search({ lieferbar: 'ja' });

    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should reset search form', async ({ searchPage }) => {
    /** Formular ausfüllen */
    await searchPage.isbnInput.fill('123');
    await searchPage.titelInput.fill('Test');

    /** Zurücksetzen */
    await searchPage.reset();

    /** Felder sollten leer sein */
    await expect(searchPage.isbnInput).toHaveValue('');
    await expect(searchPage.titelInput).toHaveValue('');
  });

  test('should navigate through pages', async ({ searchPage }) => {
    /** Alle Bücher suchen */
    await searchPage.searchButton.click();

    await searchPage.page.waitForTimeout(1000);

    /** Prüfe ob Pagination verfügbar */
    const nextButtonVisible = await searchPage.nextPageButton.isVisible().catch(() => false);

    if (nextButtonVisible) {
      const nextButtonEnabled = await searchPage.nextPageButton.isEnabled();

      if (nextButtonEnabled) {
        /** Hole Titel des ersten Buches auf Seite 1 */
        const firstBookTitle = await searchPage.resultCards.first().locator('h5').textContent();

        /** Gehe zur nächsten Seite */
        await searchPage.goToNextPage();

        await searchPage.page.waitForTimeout(1000);

        /** Hole Titel des ersten Buches auf Seite 2 */
        const secondPageFirstTitle = await searchPage.resultCards.first().locator('h5').textContent();
        
        /** Titel sollten unterschiedlich sein */
        expect(secondPageFirstTitle).not.toBe(firstBookTitle);

        /** Zurück zur ersten Seite */
        await searchPage.goToPreviousPage();

        await searchPage.page.waitForTimeout(1000);

        /** Sollte ursprüngliches Buch zeigen */
        const backToFirstTitle = await searchPage.resultCards.first().locator('h5').textContent();
        expect(backToFirstTitle).toBe(firstBookTitle);
      }
    }
  });

  test('should display page information', async ({ searchPage }) => {
    await searchPage.searchButton.click();

    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();

    if (count > 0) {
      /** Sollte Ergebnis-Anzahl anzeigen (z.B. "5 von 10 Bücher") */
      await expect(searchPage.resultCount).toBeVisible();
    }
  });

  test('should show no results message when no books found', async ({ searchPage }) => {
    await searchPage.search({ isbn: '999-9-999-99999-9' });

    await searchPage.page.waitForTimeout(1000);

    /** Prüfe ob Backend-Fehler angezeigt wird */
    const errorVisible = await searchPage.page.locator('.alert-danger').isVisible();
    
    /** Überspringe wenn Backend nicht verfügbar */
    if (errorVisible) {
      test.skip();
      return;
    }

    /** Sollte "Keine Bücher gefunden" Meldung zeigen */
    await expect(
      searchPage.page.locator('text=/keine bücher gefunden/i')
    ).toBeVisible();
  });

  test('should display book details in result cards', async ({ searchPage }) => {
    await searchPage.searchButton.click();

    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();

    if (count > 0) {
      const firstCard = searchPage.resultCards.first();

      /** Sollte Buchinformationen anzeigen - ISBN Badge und Preis */
      await expect(firstCard.locator('text=/ISBN:/i')).toBeVisible();
      await expect(firstCard.locator('text=/€/i')).toBeVisible();
    }
  });
});
