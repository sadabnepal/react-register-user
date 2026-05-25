import PropTypes from 'prop-types';
import { useState } from 'react';
import { ApiError, loginUser } from '../../api/auth';

export default function Login({ onSuccess, onBack }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async () => {
        setFormError('');
        if (!email || !password) {
            setFormError('Email and password are required');
            return;
        }

        setSubmitting(true);
        try {
            const { user } = await loginUser({ email, password });
            onSuccess(user);
        } catch (err) {
            if (err instanceof ApiError) {
                setFormError(err.message);
            } else {
                setFormError('Unable to reach the server. Is the API running?');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card">
            <h1>Login</h1>
            <p className="subtitle">Sign in to your account</p>

            {formError && <p className="form-error">{formError}</p>}

            <div className="row">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    placeholder="jane@example.com"
                />
            </div>

            <div className="row">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                    placeholder="Your password"
                />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Signing in…' : 'Sign in'}
                </button>
                <button type="button" className="reset-btn" onClick={onBack} disabled={submitting}>
                    Back
                </button>
            </div>
        </div>
    );
}

Login.propTypes = {
    onSuccess: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};
