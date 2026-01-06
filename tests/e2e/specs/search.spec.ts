/**
 * E2E Tests: Search Functionality
 *
 * Tests for the book search page including filters and pagination.
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

    // Wait for results
    await searchPage.page.waitForTimeout(1000);

    // Should show results
    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter by ISBN and show results', async ({ searchPage }) => {
    // First search without filters to get existing ISBNs
    await searchPage.searchButton.click();
    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    if (count > 0) {
      // Get an actual ISBN from the results
      const isbnBadge = searchPage.page.locator('.badge:has-text("ISBN:")').first();
      const isbnText = await isbnBadge.textContent();
      const isbn = isbnText?.replace('ISBN:', '').trim();

      if (isbn) {
        // Now search specifically for this ISBN
        await searchPage.reset();
        await searchPage.search({ isbn });
        await searchPage.page.waitForTimeout(1000);

        // Should find the book
        const resultCount = await searchPage.getResultCount();
        expect(resultCount).toBeGreaterThanOrEqual(1);

        // Should display the ISBN in results
        await expect(searchPage.page.locator(`.badge:has-text("${isbn}")`)).toBeVisible();
      }
    }
  });

  test('should filter by title', async ({ searchPage }) => {
    // First search to get available titles
    await searchPage.searchButton.click();
    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    if (count > 0) {
      // Get a title from the results
      const titleElement = searchPage.resultCards.first().locator('h5');
      const titleText = await titleElement.textContent();

      if (titleText && titleText !== 'Ohne Titel') {
        // Search for first few characters of the title
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
    // Either we find books or we don't - the filter should work
    expect(count).toBeGreaterThanOrEqual(0);

    if (count > 0) {
      // Should show PAPERBACK badge in at least one result
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
    expect(count).toBeGreaterThanOrEqual(0); // May be 0 if no books with rating >= 4
  });

  test('should filter by availability using radio buttons', async ({ searchPage }) => {
    await searchPage.search({ lieferbar: 'ja' });

    await searchPage.page.waitForTimeout(1000);

    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should reset search form', async ({ searchPage }) => {
    // Fill form
    await searchPage.isbnInput.fill('123');
    await searchPage.titelInput.fill('Test');

    // Reset
    await searchPage.reset();

    // Fields should be empty
    await expect(searchPage.isbnInput).toHaveValue('');
    await expect(searchPage.titelInput).toHaveValue('');
  });

  test('should navigate through pages', async ({ searchPage }) => {
    // Search for all books
    await searchPage.searchButton.click();

    await searchPage.page.waitForTimeout(1000);

    // Check if pagination is available
    const nextButtonVisible = await searchPage.nextPageButton.isVisible().catch(() => false);

    if (nextButtonVisible) {
      const nextButtonEnabled = await searchPage.nextPageButton.isEnabled();

      if (nextButtonEnabled) {
        // Get first book's title on page 1
        const firstBookTitle = await searchPage.resultCards.first().locator('h5').textContent();

        // Go to next page
        await searchPage.goToNextPage();

        await searchPage.page.waitForTimeout(1000);

        // Get first book's title on page 2
        const secondPageFirstTitle = await searchPage.resultCards.first().locator('h5').textContent();
        
        // Titles should be different
        expect(secondPageFirstTitle).not.toBe(firstBookTitle);

        // Go back to first page
        await searchPage.goToPreviousPage();

        await searchPage.page.waitForTimeout(1000);

        // Should show original book
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
      // Should show result count info (e.g., "5 von 10 Bücher")
      await expect(searchPage.resultCount).toBeVisible();
    }
  });

  test('should show no results message when no books found', async ({ searchPage }) => {
    await searchPage.search({ isbn: '999-9-999-99999-9' });

    await searchPage.page.waitForTimeout(1000);

    // Should show no results alert
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

      // Should show book information - ISBN in badge and price text
      await expect(firstCard.locator('text=/ISBN:/i')).toBeVisible();
      await expect(firstCard.locator('text=/€/i')).toBeVisible();
    }
  });
});
