/**
 * Page Object: CreateBookPage
 *
 * Kapselt die Buch-Erstellungsseite (nur für Admins).
 */

import { Page, Locator } from '@playwright/test';

export class CreateBookPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly isbnInput: Locator;
  readonly titelInput: Locator;
  readonly untertitelInput: Locator;
  readonly artSelect: Locator;
  readonly ratingSelect: Locator;
  readonly preisInput: Locator;
  readonly rabattInput: Locator;
  readonly lieferbarSwitch: Locator;
  readonly datumInput: Locator;
  readonly homepageInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly successAlert: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: /neues buch erstellen/i });
    this.isbnInput = page.locator('#isbn');
    this.titelInput = page.locator('#titel');
    this.untertitelInput = page.locator('#untertitel');
    this.artSelect = page.locator('#art');
    this.ratingSelect = page.locator('#rating');
    this.preisInput = page.locator('#preis');
    this.rabattInput = page.locator('#rabatt');
    this.lieferbarSwitch = page.locator('#lieferbar');
    this.datumInput = page.locator('#datum');
    this.homepageInput = page.locator('#homepage');
    this.submitButton = page.getByRole('button', { name: /buch erstellen/i });
    this.cancelButton = page.getByRole('button', { name: /abbrechen/i });
    this.successAlert = page.locator('.alert-success');
    this.errorAlert = page.locator('.alert-danger');
  }

  /** Zur Buch-Erstellungsseite navigieren */
  async goto() {
    await this.page.goto('/buch-erstellen');
  }

  /** Formular zum Erstellen eines Buches ausfüllen */
  async fillBookForm(data: {
    isbn: string;
    titel: string;
    art: string;
    preis: string;
    untertitel?: string;
    rating?: string;
    rabatt?: string;
    homepage?: string;
  }) {
    await this.isbnInput.fill(data.isbn);
    await this.titelInput.fill(data.titel);
    await this.artSelect.selectOption(data.art);
    await this.preisInput.fill(data.preis);

    if (data.untertitel) {
      await this.untertitelInput.fill(data.untertitel);
    }
    if (data.rating) {
      await this.ratingSelect.selectOption(data.rating);
    }
    if (data.rabatt) {
      await this.rabattInput.fill(data.rabatt);
    }
    if (data.homepage) {
      await this.homepageInput.fill(data.homepage);
    }
  }

  /**
   * Submit the form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Create a complete book
   */
  async createBook(data: {
    isbn: string;
    titel: string;
    art: string;
    preis: string;
    untertitel?: string;
    rating?: string;
    rabatt?: string;
    homepage?: string;
  }) {
    await this.fillBookForm(data);
    await this.submit();
  }
}
