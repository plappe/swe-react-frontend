/**
 * Page Object: Search Page
 *
 * Encapsulates the search page of the application.
 */

import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;

  // Locators
  readonly heading: Locator;
  readonly isbnInput: Locator;
  readonly titelInput: Locator;
  readonly epubCheckbox: Locator;
  readonly hardcoverCheckbox: Locator;
  readonly paperbackCheckbox: Locator;
  readonly ratingSelect: Locator;
  readonly lieferbarAlleRadio: Locator;
  readonly lieferbarJaRadio: Locator;
  readonly lieferbarNeinRadio: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly resultCards: Locator;
  readonly resultCount: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly pageInfo: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: /buchsuche/i });
    this.isbnInput = page.locator('#isbn');
    this.titelInput = page.locator('#titel');
    this.epubCheckbox = page.locator('#art-epub');
    this.hardcoverCheckbox = page.locator('#art-hardcover');
    this.paperbackCheckbox = page.locator('#art-paperback');
    this.ratingSelect = page.locator('#rating');
    this.lieferbarAlleRadio = page.locator('#lieferbar-alle');
    this.lieferbarJaRadio = page.locator('#lieferbar-ja');
    this.lieferbarNeinRadio = page.locator('#lieferbar-nein');
    this.searchButton = page.getByRole('button', { name: /^suchen$/i });
    this.resetButton = page.getByRole('button', { name: /zurücksetzen/i });
    // Only select book result cards (cards with ISBN badge), not the filter card
    this.resultCards = page.locator('.card:has(.badge)');
    this.resultCount = page.locator('text=/von.*bücher/i');
    this.nextPageButton = page.getByRole('button', { name: /weiter/i });
    // Use locator to get the pagination "Zurück" button (btn-sm class and text "Zurück")
    this.prevPageButton = page.locator('button.btn-sm:has-text("Zurück")');
    this.pageInfo = page.locator('text=/seite \\d+ von \\d+/i');
    this.deleteButtons = page.getByRole('button', { name: /löschen/i });
  }

  /**
   * Navigate to search page
   */
  async goto() {
    await this.page.goto('/suche');
  }

  /**
   * Perform a search with criteria
   */
  async search(criteria: {
    isbn?: string;
    titel?: string;
    arten?: string[];
    rating?: string;
    lieferbar?: 'alle' | 'ja' | 'nein';
  }) {
    if (criteria.isbn) {
      await this.isbnInput.fill(criteria.isbn);
    }
    if (criteria.titel) {
      await this.titelInput.fill(criteria.titel);
    }
    if (criteria.arten) {
      for (const art of criteria.arten) {
        if (art === 'EPUB') await this.epubCheckbox.check();
        if (art === 'HARDCOVER') await this.hardcoverCheckbox.check();
        if (art === 'PAPERBACK') await this.paperbackCheckbox.check();
      }
    }
    if (criteria.rating) {
      await this.ratingSelect.selectOption(criteria.rating);
    }
    if (criteria.lieferbar === 'ja') {
      await this.lieferbarJaRadio.check();
    } else if (criteria.lieferbar === 'nein') {
      await this.lieferbarNeinRadio.check();
    }

    await this.searchButton.click();
  }

  /**
   * Get number of result cards
   */
  async getResultCount(): Promise<number> {
    return await this.resultCards.count();
  }

  /**
   * Click next page button
   */
  async goToNextPage() {
    await this.nextPageButton.click();
  }

  /**
   * Click previous page button
   */
  async goToPreviousPage() {
    await this.prevPageButton.click();
  }

  /**
   * Reset search form
   */
  async reset() {
    await this.resetButton.click();
  }

  /**
   * Delete first book (admin only)
   */
  async deleteFirstBook() {
    const firstDeleteButton = this.deleteButtons.first();
    await firstDeleteButton.click();
  }
}
