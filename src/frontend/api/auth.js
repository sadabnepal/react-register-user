const API_BASE = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  constructor(message, { status, errors, field } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.field = field;
  }
}

export async function registerUser(fields) {
  const { confirmPassword: _confirmPassword, ...payload } = fields;

  const response = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || 'Registration failed', {
      status: response.status,
      errors: data.errors,
      field: data.field,
    });
  }

  return data;
}
