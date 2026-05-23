export const INITIAL_REGISTRATION_FIELDS = {
  fname: '',
  lname: '',
  email: '',
  phone: '',
  pwd: '',
  cpwd: '',
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
