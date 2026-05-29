import { expect, test } from '@playwright/test';
import { WelcomePage } from '../../pageObjects/welcomePage';
import { uniqueEmail, validUser } from '../../data/registrationData';
import { RegistrationPage } from '../../pageObjects/RegistrationPage';


test.describe('Registration UI', () => {

    test.beforeEach(async ({ page }) => {
        const welcomePage = new WelcomePage(page);
        await welcomePage.goto();
        await welcomePage.clickSignUp();
    });

    test('should render the registration form', async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await expect(registrationPage.getField('firstName')).toBeVisible();
        await expect(registrationPage.getField('lastName')).toBeVisible();
        await expect(registrationPage.getField('email')).toBeVisible();
        await expect(registrationPage.getField('phone')).toBeVisible();
        await expect(registrationPage.getField('password')).toBeVisible();
        await expect(registrationPage.getField('confirmPassword')).toBeVisible();
        await expect(registrationPage.getField('gender')).toBeVisible();
        await expect(registrationPage.getField('dob')).toBeVisible();
        await expect(registrationPage.submitButton).toBeVisible();
    });

    test('should show validation errors when required fields are missing', async ({ page }) => {
        const registrationPage = new RegistrationPage(page);
        await registrationPage.submit();

        await expect(registrationPage.getFieldError('firstName')).toHaveText('First name is required');
        await expect(registrationPage.getFieldError('lastName')).toHaveText('Last name is required');
        await expect(registrationPage.getFieldError('email')).toHaveText('Email is required');
        await expect(registrationPage.getFieldError('phone')).toHaveText('Phone number is required');
        await expect(registrationPage.getFieldError('password')).toHaveText('Password is required');
        await expect(registrationPage.getFieldError('confirmPassword')).toHaveText('Please confirm your password');
        await expect(registrationPage.getFieldError('gender')).toHaveText('Please select a gender');
        await expect(registrationPage.getFieldError('dob')).toHaveText('Date of birth is required');
    });

    test('should show password mismatch validation', async ({ page }) => {
        const registrationPage = new RegistrationPage(page);

        const registrationData = {
            firstName: validUser.firstName,
            lastName: validUser.lastName,
            email: uniqueEmail(),
            phone: validUser.phone,
            password: validUser.password,
            confirmPassword: 'mismatch123',
            gender: validUser.gender,
            dob: validUser.dob,
        };

        await registrationPage.completeRegistration(registrationData);

        await expect(registrationPage.getFieldError('confirmPassword')).toHaveText('Passwords do not match');
    });

    test.fixme('should register a new user successfully', async ({ page }) => {
        const registrationPage = new RegistrationPage(page);

        const registrationData = {
            firstName: validUser.firstName,
            lastName: validUser.lastName,
            email: uniqueEmail(),
            phone: validUser.phone,
            password: validUser.password,
            confirmPassword: validUser.password,
            gender: validUser.gender,
            dob: validUser.dob,
        };
        await registrationPage.completeRegistration(registrationData);

        await expect(page.getByText(`Welcome, ${validUser.firstName}!`)).toBeVisible();
        await expect(registrationPage.successMessage).toHaveText(
            `Your account has been created successfully, ${validUser.firstName} ${validUser.lastName}.`
        );
        await expect(registrationPage.successEmail).toHaveText(registrationData.email);
    });

});