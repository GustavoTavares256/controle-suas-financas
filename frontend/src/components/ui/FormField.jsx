export default function FormField({ label, htmlFor, required, error, hint, className = '', children }) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={htmlFor}>
          {label}
          {required && (
            <span className="required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error && <span className="field-error">{error}</span>}
      {!error && hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
