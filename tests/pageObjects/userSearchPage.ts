import type { Locator, Page } from '@playwright/test';

export class UserSearchPage {
    readonly page: Page;
    private readonly root: Locator;
    readonly heading: Locator;
    readonly emailInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly searchButton: Locator;
    readonly resultsSummary: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('.dashboard-search');
        this.heading = this.root.getByRole('heading', { name: 'Search users', exact: true });
        this.emailInput = this.root.getByLabel('Email', { exact: true });
        this.firstNameInput = this.root.getByLabel('First name', { exact: true });
        this.lastNameInput = this.root.getByLabel('Last name', { exact: true });
        this.searchButton = this.root.getByRole('button', { name: 'Search' });
        this.resultsSummary = this.root.locator('.search-results-summary');
    }

    async search(criteria: { email?: string; firstName?: string; lastName?: string }) {
        if (criteria.email !== undefined) {
            await this.emailInput.fill(criteria.email);
        }
        if (criteria.firstName !== undefined) {
            await this.firstNameInput.fill(criteria.firstName);
        }
        if (criteria.lastName !== undefined) {
            await this.lastNameInput.fill(criteria.lastName);
        }
        await this.searchButton.click();
    }

    resultItem(name: string) {
        return this.root.locator('.search-result-item').filter({ hasText: name });
    }
}
