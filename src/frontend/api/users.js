const API_BASE = import.meta.env.VITE_API_URL ?? '';

export class UserSearchError extends Error {
    constructor(message, { status } = {}) {
        super(message);
        this.name = 'UserSearchError';
        this.status = status;
    }
}

export async function searchUsers({ email, firstName, lastName }) {
    const params = new URLSearchParams();

    if (email?.trim()) params.set('email', email.trim());
    if (firstName?.trim()) params.set('firstName', firstName.trim());
    if (lastName?.trim()) params.set('lastName', lastName.trim());

    const response = await fetch(`${API_BASE}/api/users/search?${params.toString()}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new UserSearchError(data.error || 'Search failed', { status: response.status });
    }

    return data;
}
