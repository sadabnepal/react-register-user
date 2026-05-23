export function validateRegistration(fields) {
  const errors = {};

  if (!fields.fname.trim()) errors.fname = 'First name is required';
  if (!fields.lname.trim()) errors.lname = 'Last name is required';

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

  if (!fields.pwd) {
    errors.pwd = 'Password is required';
  } else if (fields.pwd.length < 8) {
    errors.pwd = 'Must be at least 8 characters';
  }

  if (!fields.cpwd) {
    errors.cpwd = 'Please confirm your password';
  } else if (fields.cpwd !== fields.pwd) {
    errors.cpwd = 'Passwords do not match';
  }

  if (!fields.gender) errors.gender = 'Please select a gender';
  if (!fields.dob) errors.dob = 'Date of birth is required';

  return errors;
}
