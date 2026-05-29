import { expect, test } from '@playwright/test';
import { WelcomePage } from '../../pageObjects/welcomePage';

test.describe('Welcome', () => {

    test.beforeEach(async ({ page }) => {
        const welcomePage = new WelcomePage(page);
        await welcomePage.goto();
    });

    test('should render the welcome screen on initial load', async ({ page }) => {
        const welcomePage = new WelcomePage(page);
        await expect(welcomePage.heading).toBeVisible();
        await expect(welcomePage.subtitle).toBeVisible();
        await expect(welcomePage.loginButton).toBeVisible();
        await expect(welcomePage.signUpButton).toBeVisible();
    });

    test('should navigate to login when Login is clicked', async ({ page }) => {
        const welcomePage = new WelcomePage(page);
        await welcomePage.clickLogin();

        await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
        await expect(page.getByText('Sign in to your account')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });

    test('should navigate to registration when Sign up is clicked', async ({ page }) => {
        const welcomePage = new WelcomePage(page);
        await welcomePage.clickSignUp();

        await expect(page.getByRole('heading', { name: 'Create account', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create my account' })).toBeVisible();
    });

    test('should return to welcome from login via Back', async ({ page }) => {
        const welcomePage = new WelcomePage(page);
        await welcomePage.clickLogin();
        await page.getByRole('button', { name: 'Back' }).click();

        await expect(welcomePage.heading).toBeVisible();
        await expect(welcomePage.loginButton).toBeVisible();
        await expect(welcomePage.signUpButton).toBeVisible();
    });

});
