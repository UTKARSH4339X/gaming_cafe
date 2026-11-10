export default function Field({ label, hint, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small className="err">{error}</small> : hint ? <small>{hint}</small> : null}
    </label>
  );
}
