import type { Locator, Page } from '@playwright/test';

export class WelcomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly loginButton: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Welcome', exact: true });
    this.subtitle = page.getByText('Create an account or sign in to continue.');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickSignUp() {
    await this.signUpButton.click();
  }
}
