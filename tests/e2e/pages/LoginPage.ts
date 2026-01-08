/**
 * Page Object: LoginPage
 *
 * Kapselt die Login-Seite der Anwendung.
 */

import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    readonly heading: Locator;
    readonly loginButton: Locator;
    readonly errorAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        this.heading = page.getByRole('heading', { name: /anmeldung/i });
        this.loginButton = page.getByRole('button', { name: /mit keycloak anmelden/i });
        this.errorAlert = page.getByRole('alert');
    }

    /** Zur Login-Seite navigieren */
    async goto() {
        await this.page.goto('/login');
    }

    /** Keycloak Login Button klicken */
    async clickLogin() {
        await this.loginButton.click();
    }
}
