import type { Locator, Page } from '@playwright/test';

export class RegistrationPage {
    readonly page: Page;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly phoneInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly genderSelect: Locator;
    private readonly dobInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    readonly successEmail: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByLabel('First name', { exact: true });
        this.lastNameInput = page.getByLabel('Last name', { exact: true });
        this.emailInput = page.getByLabel('Email address', { exact: true });
        this.phoneInput = page.getByLabel('Phone number', { exact: true });
        this.passwordInput = page.getByLabel('Password', { exact: true });
        this.confirmPasswordInput = page.getByLabel('Confirm password', { exact: true });
        this.genderSelect = page.getByLabel('Gender', { exact: true });
        this.dobInput = page.getByLabel('Date of birth', { exact: true });
        this.submitButton = page.getByRole('button', { name: 'Create my account' });
        this.successMessage = page.getByText('Your account has been created successfully,', { exact: false });
        this.successEmail = page.locator('.pill');
    }

    async goto() {
        await this.page.goto('/');
    }

    async fillName(firstName: string, lastName: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
    }

    async fillContact(email: string, phone: string) {
        await this.emailInput.fill(email);
        await this.phoneInput.fill(phone);
    }

    async fillPassword(password: string, confirmPassword: string) {
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    async chooseGender(gender: string) {
        await this.genderSelect.selectOption(gender);
    }

    async setDob(dob: string) {
        await this.dobInput.fill(dob);
    }

    async submit() {
        await this.submitButton.click();
    }

    async completeRegistration(fields: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
        gender: string;
        dob: string;
    }) {
        await this.fillName(fields.firstName, fields.lastName);
        await this.fillContact(fields.email, fields.phone);
        await this.fillPassword(fields.password, fields.confirmPassword);
        await this.chooseGender(fields.gender);
        await this.setDob(fields.dob);
        await this.submit();
    }

    getField(fieldId: string) {
        const labelMap: Record<string, string> = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email address',
            phone: 'Phone number',
            password: 'Password',
            confirmPassword: 'Confirm password',
            gender: 'Gender',
            dob: 'Date of birth',
        };
        const label = labelMap[fieldId];
        if (!label) {
            throw new Error(`Unknown field id: ${fieldId}`);
        }
        return this.page.getByLabel(label, { exact: true });
    }

    getFieldError(fieldId: string) {
        const labelMap: Record<string, string> = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email address',
            phone: 'Phone number',
            password: 'Password',
            confirmPassword: 'Confirm password',
            gender: 'Gender',
            dob: 'Date of birth',
        };
        const label = labelMap[fieldId];
        if (!label) {
            throw new Error(`Unknown field id: ${fieldId}`);
        }
        return this.page.getByLabel(label, { exact: true }).locator('..').locator('.error-text');
    }

}
