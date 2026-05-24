export const INITIAL_REGISTRATION_FIELDS = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: '',
  dob: '',
};

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
];

export const TODAY_ISO = new Date().toISOString().split('T')[0];
