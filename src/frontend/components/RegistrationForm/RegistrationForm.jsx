import { useState } from 'react';
import { ApiError, registerUser } from '../../api/auth';
import {
  GENDER_OPTIONS,
  INITIAL_REGISTRATION_FIELDS,
  TODAY_ISO,
} from '../../constants/registration';
import { validateRegistration } from '../../utils/validateRegistration';
import Field from '../Field/Field';

export default function RegistrationForm({ onSuccess }) {
  const [fields, setFields] = useState(INITIAL_REGISTRATION_FIELDS);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const set =
    (key) =>
    (e) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setFormError('');
    const errs = validateRegistration(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const { user } = await registerUser(fields);
      onSuccess(user);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setErrors(err.errors);
        } else if (err.field) {
          setErrors((prev) => ({ ...prev, [err.field]: err.message }));
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError('Unable to reach the server. Is the API running?');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inp = (key, props = {}) => (
    <input
      id={key}
      className={errors[key] ? 'error' : ''}
      value={fields[key]}
      onChange={set(key)}
      disabled={submitting}
      {...props}
    />
  );

  return (
    <div className="card">
      <h1>Create account</h1>
      <p className="subtitle">Join us today — it's completely free.</p>

      {formError && <p className="form-error">{formError}</p>}

      <div className="row">
        <Field label="First name" id="firstName" error={errors.firstName}>
          {inp('firstName', { placeholder: 'Jane' })}
        </Field>
        <Field label="Last name" id="lastName" error={errors.lastName}>
          {inp('lastName', { placeholder: 'Doe' })}
        </Field>
      </div>

      <Field label="Email address" id="email" error={errors.email}>
        {inp('email', { placeholder: 'jane@example.com' })}
      </Field>

      <Field label="Phone number" id="phone" error={errors.phone}>
        {inp('phone', { placeholder: '+1 555 000 0000' })}
      </Field>

      <div className="row">
        <Field label="Password" id="password" error={errors.password}>
          {inp('password', { type: 'password', placeholder: 'Min 8 characters' })}
        </Field>
        <Field label="Confirm password" id="confirmPassword" error={errors.confirmPassword}>
          {inp('confirmPassword', { type: 'password', placeholder: 'Repeat password' })}
        </Field>
      </div>

      <Field label="Gender" id="gender" error={errors.gender}>
        <select
          id="gender"
          className={errors.gender ? 'error' : ''}
          value={fields.gender}
          onChange={set('gender')}
          disabled={submitting}
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

      <button
        type="button"
        className="btn"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? 'Creating account…' : 'Create my account'}
      </button>
    </div>
  );
}
