/**
 * Page Object: HomePage
 *
 * Page Objects sind ein Design Pattern für E2E-Tests.
 * Sie kapseln die Struktur einer Seite und bieten
 * eine saubere API für Tests.
 *
 * Vorteile:
 * - DRY: Selektoren nur einmal definiert
 * - Wartbar: Bei UI-Änderungen nur Page Object anpassen
 * - Lesbar: Tests beschreiben Verhalten, nicht DOM-Struktur
 */

import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    readonly heading: Locator;
    readonly searchButton: Locator;
    readonly createButton: Locator;
    readonly loginButton: Locator;

    /**
     * Initialisiert alle Locators.
     * Locators suchen Elemente erst wenn sie verwendet werden.
     */
    constructor(page: Page) {
        this.page = page;

        /** getByRole findet Elemente nach ihrer semantischen Rolle (barrierefrei) */
        this.heading = page.getByRole('heading', { name: /buchverwaltung/i });

        this.searchButton = page.getByRole('button', { name: /zur suche/i });
        this.createButton = page.getByRole('link', { name: /buch erstellen/i });
        this.loginButton = page.getByRole('link', { name: 'Jetzt anmelden' });
    }

    /** Zur Startseite navigieren */
    async goto() {
        await this.page.goto('/');
    }

    /** Zur Suchseite über den Button navigieren */
    async goToSearch() {
        await this.searchButton.click();
    }

    /**
     * Klickt auf "Buch anlegen" Button
     */
    async goToCreate() {
        await this.createButton.click();
    }

    /**
     * Klickt auf Login Button
     */
    async clickLogin() {
        await this.loginButton.click();
    }
}
