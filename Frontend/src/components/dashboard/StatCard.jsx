export default function StatCard({ icon: Icon, value, label, trend, colorClass, delay = 0 }) {
  return (
    <div
      className="card stat-card"
      style={{ animationDelay: `${delay}ms`, animation: 'fadeInUp 0.5s var(--ease-out) both' }}
    >
      <div className="card-body">
        <div className={`stat-card__icon-wrap stat-card__icon-wrap--${colorClass}`}>
          <Icon />
        </div>
        <div className="stat-card__info">
          <div className="stat-card__value">{value}</div>
          <div className="stat-card__label">{label}</div>
          {trend && (
            <div className="stat-card__trend stat-card__trend--neutral">
              {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
