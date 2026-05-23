import { useState } from 'react';
import Field from '../Field/Field';
import {
  GENDER_OPTIONS,
  INITIAL_REGISTRATION_FIELDS,
  TODAY_ISO,
} from '../../constants/registration';
import { validateRegistration } from '../../utils/validateRegistration';

export default function RegistrationForm({ onSuccess }) {
  const [fields, setFields] = useState(INITIAL_REGISTRATION_FIELDS);
  const [errors, setErrors] = useState({});

  const set =
    (key) =>
    (e) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    const errs = validateRegistration(fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSuccess(fields);
    }
  };

  const inp = (key, props = {}) => (
    <input
      id={key}
      className={errors[key] ? 'error' : ''}
      value={fields[key]}
      onChange={set(key)}
      {...props}
    />
  );

  return (
    <div className="card">
      <h1>Create account</h1>
      <p className="subtitle">Join us today — it's completely free.</p>

      <div className="row">
        <Field label="First name" id="fname" error={errors.fname}>
          {inp('fname', { placeholder: 'Jane' })}
        </Field>
        <Field label="Last name" id="lname" error={errors.lname}>
          {inp('lname', { placeholder: 'Doe' })}
        </Field>
      </div>

      <Field label="Email address" id="email" error={errors.email}>
        {inp('email', { placeholder: 'jane@example.com' })}
      </Field>

      <Field label="Phone number" id="phone" error={errors.phone}>
        {inp('phone', { placeholder: '+1 555 000 0000' })}
      </Field>

      <div className="row">
        <Field label="Password" id="pwd" error={errors.pwd}>
          {inp('pwd', { type: 'password', placeholder: 'Min 8 characters' })}
        </Field>
        <Field label="Confirm password" id="cpwd" error={errors.cpwd}>
          {inp('cpwd', { type: 'password', placeholder: 'Repeat password' })}
        </Field>
      </div>

      <Field label="Gender" id="gender" error={errors.gender}>
        <select
          id="gender"
          className={errors.gender ? 'error' : ''}
          value={fields.gender}
          onChange={set('gender')}
        >
          <option value="">— Select —</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Date of birth" id="dob" error={errors.dob}>
        {inp('dob', { type: 'date', max: TODAY_ISO })}
      </Field>

      <button type="button" className="btn" onClick={handleSubmit}>
        Create my account
      </button>
    </div>
  );
}
