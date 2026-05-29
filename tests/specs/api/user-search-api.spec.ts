import { test, expect } from '@playwright/test';
import { uniqueEmail } from '../../data/registrationData';

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

test.describe('User search API', () => {

    test('GET /api/users/search returns 400 when no criteria provided', async ({ request }) => {
        const response = await request.get(`${API_BASE}/api/users/search`);
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toContain('at least one search field');
    });

    test('GET /api/users/search finds user by email only', async ({ request }) => {
        const payload = signupPayload({ firstName: 'SearchEmail', lastName: 'Only' });
        const signup = await request.post(`${API_BASE}/api/auth/signup`, { data: payload });
        expect(signup.status()).toBe(201);

        const response = await request.get(
            `${API_BASE}/api/users/search?email=${encodeURIComponent(payload.email)}`
        );
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.count).toBe(1);
        expect(body.users[0].email).toBe(payload.email);
        expect(body.users[0].firstName).toBe('SearchEmail');
    });

    test.fixme('GET /api/users/search filters by all three fields', async ({ request }) => {
        const payload = signupPayload({
            firstName: 'Triple',
            lastName: 'Match',
            email: uniqueEmail(),
        });

        await request.post(`${API_BASE}/api/auth/signup`, { data: payload });
        await request.post(`${API_BASE}/api/auth/signup`, {
            data: signupPayload({ firstName: 'Triple', lastName: 'Other' }),
        });

        const response = await request.get(`${API_BASE}/api/users/search`, {
            params: {
                email: encodeURIComponent(payload.email),
                firstName: payload.firstName,
                lastName: payload.lastName
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log("body:", body);
        expect(body.count).toBe(1);
        expect(body.users[0].email).toBe(payload.email);
        expect(body.users[0].lastName).toBe(payload.lastName);
    });

    test('GET /api/users/search returns empty when criteria do not match', async ({ request }) => {
        const payload = signupPayload();
        await request.post(`${API_BASE}/api/auth/signup`, { data: payload });

        const response = await request.get(
            `${API_BASE}/api/users/search?firstName=NoSuchName${Date.now()}`
        );
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.count).toBe(0);
        expect(body.users).toEqual([]);
    });

    test('GET /api/users/search is case-insensitive for email', async ({ request }) => {
        const email = uniqueEmail();
        const payload = signupPayload({ email });
        await request.post(`${API_BASE}/api/auth/signup`, { data: payload });

        const response = await request.get(
            `${API_BASE}/api/users/search?email=${encodeURIComponent(email.toUpperCase())}`
        );
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.count).toBe(1);
        expect(body.users[0].email).toBe(email);
    });
});
