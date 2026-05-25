import { test, expect } from '@playwright/test';
import { uniqueEmail } from '../data/registrationData';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';

function signupPayload(overrides = {}) {
    return {
        firstName: 'Jane',
        lastName: 'Doe',
        email: uniqueEmail(),
        phone: '+1 555 000 0000',
        password: 'SecurePass123',
        gender: 'Female',
        dob: '1990-01-15',
        ...overrides,
    };
}

test.describe('Registration API', () => {
  
    test('GET /api/health returns ok', async ({ request }) => {
        const response = await request.get(`${API_BASE}/api/health`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toEqual({ status: 'ok' });
    });

    test('POST /api/auth/signup succeeds with valid payload', async ({ request }) => {
        const payload = signupPayload();
        const response = await request.post(`${API_BASE}/api/auth/signup`, { data: payload });

        expect(response.status()).toBe(201);
        const body = await response.json();

        expect(body.message).toBe('Account created successfully');
        expect(body.user).toBeTruthy();
        expect(body.user.email).toBe(payload.email);
        expect(body.user.firstName).toBe(payload.firstName);
        expect(body.user.lastName).toBe(payload.lastName);
        expect(body.user.dob).toBe(payload.dob);
        expect(body.user).not.toHaveProperty('password');
        expect(body.user).not.toHaveProperty('password_hash');
        expect(body.user.id).toBeTruthy();
        expect(body.user.createdAt).toBeTruthy();
    });

    test('POST /api/auth/signup returns 400 when required fields are missing', async ({ request }) => {
        const response = await request.post(`${API_BASE}/api/auth/signup`, { data: {} });

        expect(response.status()).toBe(400);
        const body = await response.json();

        expect(body.errors).toBeTruthy();
        expect(body.errors.firstName).toBe('First name is required');
        expect(body.errors.lastName).toBe('Last name is required');
        expect(body.errors.email).toBe('Email is required');
        expect(body.errors.phone).toBe('Phone number is required');
        expect(body.errors.password).toBe('Password is required');
        expect(body.errors.gender).toBe('Please select a gender');
        expect(body.errors.dob).toBe('Date of birth is required');
    });

    test('POST /api/auth/signup returns 400 for invalid email format', async ({ request }) => {
        const payload = signupPayload({ email: 'invalid-email' });
        const response = await request.post(`${API_BASE}/api/auth/signup`, { data: payload });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.errors.email).toBe('Enter a valid email address');
    });

    test('POST /api/auth/signup returns 400 for short password', async ({ request }) => {
        const payload = signupPayload({ password: 'short', email: uniqueEmail() });
        const response = await request.post(`${API_BASE}/api/auth/signup`, { data: payload });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.errors.password).toBe('Must be at least 8 characters');
    });

    test('POST /api/auth/signup returns 400 for invalid phone format', async ({ request }) => {
        const payload = signupPayload({ phone: 'abc123', email: uniqueEmail() });
        const response = await request.post(`${API_BASE}/api/auth/signup`, { data: payload });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.errors.phone).toBe('Enter a valid phone number');
    });

    test('POST /api/auth/signup returns 409 for duplicate email', async ({ request }) => {
        const email = uniqueEmail();
        const firstPayload = signupPayload({ email });
        const secondPayload = signupPayload({ email, firstName: 'John', lastName: 'Smith' });

        const firstResponse = await request.post(`${API_BASE}/api/auth/signup`, { data: firstPayload });
        expect(firstResponse.status()).toBe(201);

        const secondResponse = await request.post(`${API_BASE}/api/auth/signup`, { data: secondPayload });
        expect(secondResponse.status()).toBe(409);
        const body = await secondResponse.json();
        expect(body.error).toBe('An account with this email already exists');
        expect(body.field).toBe('email');
    });

    test('POST /api/auth/signup is case-insensitive for duplicate email', async ({ request }) => {
        const email = uniqueEmail();
        const firstPayload = signupPayload({ email: email.toUpperCase() });
        const secondPayload = signupPayload({ email, firstName: 'John', lastName: 'Smith' });

        const firstResponse = await request.post(`${API_BASE}/api/auth/signup`, { data: firstPayload });
        expect(firstResponse.status()).toBe(201);

        const secondResponse = await request.post(`${API_BASE}/api/auth/signup`, { data: secondPayload });
        expect(secondResponse.status()).toBe(409);
        const body = await secondResponse.json();
        expect(body.error).toBe('An account with this email already exists');
        expect(body.field).toBe('email');
    });
});
