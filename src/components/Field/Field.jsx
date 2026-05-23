export default function Field({ label, id, children, error }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      <span className="error-text">{error || ''}</span>
    </div>
  );
}
