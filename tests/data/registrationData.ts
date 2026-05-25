export const validUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '+1 555 000 0000',
  password: 'password123',
  gender: 'Female',
  dob: '1990-01-01',
};

export const uniqueEmail = () => `playwright+${crypto.randomUUID()}@example.com`;