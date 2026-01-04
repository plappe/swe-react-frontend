/**
 * Page Object: Login Page
 *
 * Kapselt die Login-Seite der Anwendung.
 */

import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    // Locators
    readonly heading: Locator;
    readonly loginButton: Locator;
    readonly errorAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        this.heading = page.getByRole('heading', { name: /anmeldung/i });
        this.loginButton = page.getByRole('button', { name: /mit keycloak anmelden/i });
        this.errorAlert = page.getByRole('alert');
    }

    /**
     * Navigiert zur Login-Seite
     */
    async goto() {
        await this.page.goto('/login');
    }

    /**
     * Klickt auf den Keycloak Login Button
     */
    async clickLogin() {
        await this.loginButton.click();
    }
}
