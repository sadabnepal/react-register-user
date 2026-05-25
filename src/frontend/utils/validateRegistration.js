export function validateRegistration(fields) {
    const errors = {};

    if (!fields.firstName.trim()) errors.firstName = 'First name is required';
    if (!fields.lastName.trim()) errors.lastName = 'Last name is required';

    if (!fields.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        errors.email = 'Enter a valid email address';
    }

    if (!fields.phone.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-(). ]{7,15}$/.test(fields.phone)) {
        errors.phone = 'Enter a valid phone number';
    }

    if (!fields.password) {
        errors.password = 'Password is required';
    } else if (fields.password.length < 8) {
        errors.password = 'Must be at least 8 characters';
    }

    if (!fields.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (fields.confirmPassword !== fields.password) {
        errors.confirmPassword = 'Passwords do not match';
    }

    if (!fields.gender) errors.gender = 'Please select a gender';
    if (!fields.dob) errors.dob = 'Date of birth is required';

    return errors;
}
