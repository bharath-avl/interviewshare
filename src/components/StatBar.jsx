import './StatBar.css';

export default function StatBar({ interviews }) {
  if (!interviews || interviews.length === 0) return null;

  const totalInterviews = interviews.length;
  const avgDifficulty = (
    interviews.reduce((sum, i) => sum + (i.difficulty || 0), 0) / totalInterviews
  ).toFixed(1);

  // Outcome distribution
  const outcomes = {};
  interviews.forEach(i => {
    outcomes[i.outcome] = (outcomes[i.outcome] || 0) + 1;
  });

  // Role distribution
  const roles = {};
  interviews.forEach(i => {
    roles[i.role] = (roles[i.role] || 0) + 1;
  });
  const topRoles = Object.entries(roles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const outcomeColors = {
    Offered: 'var(--color-success)',
    Rejected: 'var(--color-error)',
    Ghosted: 'var(--color-warning)',
    Waiting: 'var(--color-info)',
    Withdrew: 'var(--text-tertiary)',
  };

  return (
    <div className="stat-bar" id="stat-bar">
      <div className="stat-bar-metrics">
        <div className="stat-bar-metric">
          <span className="stat-bar-value">{totalInterviews}</span>
          <span className="stat-bar-label">Interviews</span>
        </div>
        <div className="stat-bar-metric">
          <span className="stat-bar-value">{avgDifficulty}</span>
          <span className="stat-bar-label">Avg Difficulty</span>
        </div>
        <div className="stat-bar-metric">
          <span className="stat-bar-value">{Object.keys(roles).length}</span>
          <span className="stat-bar-label">Roles</span>
        </div>
      </div>

      {Object.keys(outcomes).length > 0 && (
        <div className="stat-bar-section">
          <span className="stat-bar-section-title">Outcomes</span>
          <div className="stat-bar-segments">
            {Object.entries(outcomes).map(([outcome, count]) => (
              <div
                key={outcome}
                className="stat-bar-segment"
                style={{
                  flex: count,
                  background: outcomeColors[outcome] || 'var(--surface-4)',
                }}
                title={`${outcome}: ${count}`}
              />
            ))}
          </div>
          <div className="stat-bar-legend">
            {Object.entries(outcomes).map(([outcome, count]) => (
              <span key={outcome} className="stat-bar-legend-item">
                <span
                  className="stat-bar-legend-dot"
                  style={{ background: outcomeColors[outcome] || 'var(--surface-4)' }}
                />
                {outcome} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {topRoles.length > 0 && (
        <div className="stat-bar-section">
          <span className="stat-bar-section-title">Top Roles</span>
          <div className="stat-bar-roles">
            {topRoles.map(([role, count]) => (
              <div key={role} className="stat-bar-role">
                <span className="stat-bar-role-name">{role}</span>
                <div className="stat-bar-role-bar-bg">
                  <div
                    className="stat-bar-role-bar-fill"
                    style={{ width: `${(count / totalInterviews) * 100}%` }}
                  />
                </div>
                <span className="stat-bar-role-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
