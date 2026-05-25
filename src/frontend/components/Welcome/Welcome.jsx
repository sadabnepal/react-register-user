import PropTypes from 'prop-types';

export default function Welcome({ onLogin, onSignup }) {
    return (
        <div className="card">
            <h1>Welcome</h1>
            <p className="subtitle">Create an account or sign in to continue.</p>
            <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn" onClick={onLogin}>
                    Login
                </button>
                <button type="button" className="btn" onClick={onSignup}>
                    Sign up
                </button>
            </div>
        </div>
    );
}

Welcome.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
};
