export function validateSignupBody(body) {
    const errors = {};
    const fields = {
        firstName: body.firstName?.trim() ?? '',
        lastName: body.lastName?.trim() ?? '',
        email: body.email?.trim() ?? '',
        phone: body.phone?.trim() ?? '',
        password: body.password ?? '',
        gender: body.gender?.trim() ?? '',
        dob: body.dob?.trim() ?? '',
    };

    if (!fields.firstName) errors.firstName = 'First name is required';
    if (!fields.lastName) errors.lastName = 'Last name is required';

    if (!fields.email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        errors.email = 'Enter a valid email address';
    }

    if (!fields.phone) {
        errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-(). ]{7,15}$/.test(fields.phone)) {
        errors.phone = 'Enter a valid phone number';
    }

    if (!fields.password) {
        errors.password = 'Password is required';
    } else if (fields.password.length < 8) {
        errors.password = 'Must be at least 8 characters';
    }

    if (!fields.gender) errors.gender = 'Please select a gender';
    if (!fields.dob) errors.dob = 'Date of birth is required';

    return { errors, fields };
}
