export default function StatCard({ label, value, icon: Icon, iconClass, hint, valueClass }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {Icon && (
          <span className={`stat-icon ${iconClass || ''}`}>
            <Icon size={18} />
          </span>
        )}
      </div>
      <div className={`stat-value ${valueClass || ''}`}>{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}
