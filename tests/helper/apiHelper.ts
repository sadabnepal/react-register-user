import { uniqueEmail, validUser } from '../data/registrationData';
import { APIRequestContext, expect } from '@playwright/test';

export async function createUserViaApi(request: APIRequestContext, baseUrl: string, overrides: Record<string, string> = {}) {

    const email = overrides.email ?? uniqueEmail();

    const response = await request.post(`${baseUrl}/api/auth/signup`, {
        data: {
            firstName: validUser.firstName,
            lastName: validUser.lastName,
            email,
            phone: validUser.phone,
            password: validUser.password,
            gender: validUser.gender,
            dob: validUser.dob,
            ...overrides
        }
    });

    expect(response.status()).toBe(201);
    return { email, password: validUser.password };
}