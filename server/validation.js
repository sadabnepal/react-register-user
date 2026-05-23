export function validateSignupBody(body) {
  const errors = {};
  const fields = {
    fname: body.fname?.trim() ?? '',
    lname: body.lname?.trim() ?? '',
    email: body.email?.trim() ?? '',
    phone: body.phone?.trim() ?? '',
    pwd: body.pwd ?? '',
    gender: body.gender?.trim() ?? '',
    dob: body.dob?.trim() ?? '',
  };

  if (!fields.fname) errors.fname = 'First name is required';
  if (!fields.lname) errors.lname = 'Last name is required';

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

  if (!fields.pwd) {
    errors.pwd = 'Password is required';
  } else if (fields.pwd.length < 8) {
    errors.pwd = 'Must be at least 8 characters';
  }

  if (!fields.gender) errors.gender = 'Please select a gender';
  if (!fields.dob) errors.dob = 'Date of birth is required';

  return { errors, fields };
}
