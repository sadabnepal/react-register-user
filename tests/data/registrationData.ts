import { faker } from '@faker-js/faker';

export const validUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: '+1 555 000 0000',
    password: faker.internet.password({ length: 12, memorable: true }),
    gender: 'Female',
    dob: '1990-01-01',
};

export const uniqueEmail = () => faker.internet.email({ firstName: validUser.firstName, lastName: validUser.lastName, provider: 'example.com' });