import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pageObjects/dashboardPage';
import { UserSearchPage } from '../pageObjects/userSearchPage';
import { WelcomePage } from '../pageObjects/welcomePage';
import { RegistrationPage } from '../pageObjects/registrationPage';
import { uniqueEmail, validUser } from '../data/registrationData';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';

async function createUser(
    request: import('@playwright/test').APIRequestContext,
    overrides: Record<string, string> = {}
) {
    const email = overrides.email ?? uniqueEmail();
    const response = await request.post(`${API_BASE}/api/auth/signup`, {
        data: {
            firstName: validUser.firstName,
            lastName: validUser.lastName,
            email,
            phone: validUser.phone,
            password: validUser.password,
            gender: validUser.gender,
            dob: validUser.dob,
            ...overrides,
        },
    });
    expect(response.status()).toBe(201);
    return { email, password: validUser.password };
}

test.describe('User search UI', () => {

    test.beforeEach(async ({ page, request }) => {
        const { email, password } = await createUser(request);
        await DashboardPage.openAfterLogin(page, email, password);
    });

    test('should render search on the dashboard after login', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const userSearchPage = new UserSearchPage(page);

        await expect(dashboardPage.welcomeHeading).toBeVisible();
        await expect(userSearchPage.heading).toBeVisible();
        await expect(userSearchPage.emailInput).toBeVisible();
        await expect(userSearchPage.firstNameInput).toBeVisible();
        await expect(userSearchPage.lastNameInput).toBeVisible();
        await expect(userSearchPage.searchButton).toBeVisible();
    });

    test('should require at least one search field', async ({ page }) => {
        const userSearchPage = new UserSearchPage(page);
        await userSearchPage.searchButton.click();
        await expect(page.getByText('Enter at least one of email, first name, or last name')).toBeVisible();
    });

    test('should display only matching users', async ({ page, request }) => {
        const tag = Date.now().toString();
        const matchName = `FindMe${tag}`;
        const targetLabel = `${matchName} Target`;
        const otherLabel = `${matchName} Other`;

        await request.post(`${API_BASE}/api/auth/signup`, {
            data: {
                firstName: matchName,
                lastName: 'Target',
                email: uniqueEmail(),
                phone: validUser.phone,
                password: validUser.password,
                gender: validUser.gender,
                dob: validUser.dob,
            },
        });

        await request.post(`${API_BASE}/api/auth/signup`, {
            data: {
                firstName: matchName,
                lastName: 'Other',
                email: uniqueEmail(),
                phone: validUser.phone,
                password: validUser.password,
                gender: validUser.gender,
                dob: validUser.dob,
            },
        });

        const userSearchPage = new UserSearchPage(page);
        await userSearchPage.search({ firstName: matchName, lastName: 'Target' });

        await expect(userSearchPage.resultsSummary).toHaveText('1 matching user');
        await expect(userSearchPage.resultItem(targetLabel)).toBeVisible();
        await expect(userSearchPage.resultItem(otherLabel)).toHaveCount(0);
    });

    test('should show no results message when nothing matches', async ({ page }) => {
        const userSearchPage = new UserSearchPage(page);
        await userSearchPage.search({ email: `nobody-${Date.now()}@example.com` });
        await expect(userSearchPage.resultsSummary).toHaveText('No users match your search.');
    });
});

test.describe('User search UI after sign up', () => {

    test('should show search on dashboard after sign up', async ({ page }) => {
        const email = uniqueEmail();
        const welcomePage = new WelcomePage(page);
        const registrationPage = new RegistrationPage(page);

        await welcomePage.goto();
        await welcomePage.clickSignUp();
        await registrationPage.completeRegistration({
            firstName: 'Signed',
            lastName: 'Up',
            email,
            phone: validUser.phone,
            password: validUser.password,
            confirmPassword: validUser.password,
            gender: validUser.gender,
            dob: validUser.dob,
        });

        const dashboardPage = new DashboardPage(page);
        const userSearchPage = new UserSearchPage(page);

        await expect(dashboardPage.welcomeHeading).toHaveText('Welcome back, Signed!');
        await expect(userSearchPage.heading).toBeVisible();
    });

});
