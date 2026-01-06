/**
 * Page Object: Home Page
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
    // Seite (Browser-Tab)
    readonly page: Page;

    // Locators für Elemente auf der Seite
    readonly heading: Locator;
    readonly searchButton: Locator;
    readonly createButton: Locator;
    readonly loginButton: Locator;

    /**
     * Constructor
     *
     * Initialisiert alle Locators.
     * Locators suchen Elemente erst wenn sie verwendet werden.
     */
    constructor(page: Page) {
        this.page = page;

        // getByRole findet Elemente nach ihrer semantischen Rolle
        // Das ist barrierefrei und robust gegen CSS-Änderungen
        this.heading = page.getByRole('heading', { name: /buchverwaltung/i });

        // getByRole mit 'link' findet <a> Tags
        this.searchButton = page.getByRole('button', { name: /zur suche/i });
        this.createButton = page.getByRole('link', { name: /buch erstellen/i });

        // Link für Login - use the specific "Jetzt anmelden" link text
        this.loginButton = page.getByRole('link', { name: 'Jetzt anmelden' });
    }

    /**
     * Navigiert zur Startseite
     */
    async goto() {
        await this.page.goto('/');
    }

    /**
     * Navigiert zur Suchseite über den Button
     */
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
