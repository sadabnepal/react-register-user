import type { Locator, Page } from '@playwright/test';
import { WelcomePage } from './welcomePage';
import { LoginPage } from './loginPage';

export class DashboardPage {
    readonly page: Page;
    readonly welcomeHeading: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.welcomeHeading = page.getByRole('heading', { name: /Welcome back,/ });
        this.logoutButton = page.getByRole('button', { name: 'Log out' });
    }

    static async openAfterLogin(page: Page, email: string, password: string) {
        const welcomePage = new WelcomePage(page);
        await welcomePage.goto();
        await welcomePage.clickLogin();
        const loginPage = new LoginPage(page);
        await loginPage.signIn(email, password);
        return new DashboardPage(page);
    }
}
