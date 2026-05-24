export default function SuccessScreen({ fields, onReset }) {
  return (
    <div className="card">
      <div className="success">
        <div className="check-circle">
          <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="17" cy="17" r="16" stroke="#1D9E75" strokeWidth="1.5" />
            <path
              d="M10 17.5l5.5 5.5 9.5-11"
              stroke="#1D9E75"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="success-name">Welcome, {fields.firstName}!</p>
        <p className="success-msg">
          Your account has been created successfully, {fields.firstName}{' '}
          {fields.lastName}. We've sent a confirmation to your email address.
        </p>
        <span className="pill">{fields.email}</span>
        <br />
        <button type="button" className="reset-btn" onClick={onReset}>
          Register another account
        </button>
      </div>
    </div>
  );
}
