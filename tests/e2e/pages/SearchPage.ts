/**
 * Page Object: Search Page
 *
 * Kapselt die Suchseite der Anwendung.
 */

import { Page, Locator } from '@playwright/test';

export class SearchPage {
    readonly page: Page;

    // Locators
    readonly heading: Locator;

    // Suchformular Felder (werden später implementiert)
    // readonly isbnInput: Locator;
    // readonly titelInput: Locator;
    // readonly artDropdown: Locator;
    // readonly searchButton: Locator;
    // readonly resultsList: Locator;

    constructor(page: Page) {
        this.page = page;

        this.heading = page.getByRole('heading', { name: /buchsuche/i });
    }

    /**
     * Navigiert zur Suchseite
     */
    async goto() {
        await this.page.goto('/suche');
    }

    /**
     * Führt eine Suche durch (wird später implementiert)
     */
    // async search(criteria: { isbn?: string; titel?: string }) {
    //     if (criteria.isbn) {
    //         await this.isbnInput.fill(criteria.isbn);
    //     }
    //     if (criteria.titel) {
    //         await this.titelInput.fill(criteria.titel);
    //     }
    //     await this.searchButton.click();
    // }
}
