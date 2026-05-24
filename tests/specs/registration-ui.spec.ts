import { expect, test } from '@playwright/test';
import { RegistrationPage } from '../pageObjects/registrationPage';
import { uniqueEmail, validUser } from '../data/registrationData';


test.describe('Registration UI', () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
  });

  test('should render the registration form', async () => {
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

  test('should show validation errors when required fields are missing', async () => {
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

  test('should show password mismatch validation', async () => {
    await registrationPage.completeRegistration({
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: uniqueEmail(),
      phone: validUser.phone,
      password: validUser.password,
      confirmPassword: 'mismatch123',
      gender: validUser.gender,
      dob: validUser.dob,
    });

    await expect(registrationPage.getFieldError('confirmPassword')).toHaveText('Passwords do not match');
  });

  test('should register a new user successfully', async () => {
    const testEmail = uniqueEmail();

    await registrationPage.completeRegistration({
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: testEmail,
      phone: validUser.phone,
      password: validUser.password,
      confirmPassword: validUser.password,
      gender: validUser.gender,
      dob: validUser.dob,
    });

    await expect(registrationPage.successName).toHaveText(`Welcome, ${validUser.firstName}!`);
    await expect(registrationPage.successMessage).toContainText(
      `Your account has been created successfully, ${validUser.firstName} ${validUser.lastName}.`
    );
    await expect(registrationPage.successEmail).toHaveText(testEmail);
  });
});
