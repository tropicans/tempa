import { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  trend?: { direction: 'up' | 'down'; label: string };
};

export function StatCard({ label, value, hint, icon, trend }: StatCardProps) {
  return (
    <div className="metric-card">
      {icon && <div className="metric-card-icon">{icon}</div>}
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {trend && (
        <div className={`metric-trend ${trend.direction}`}>
          {trend.direction === 'up' ? '↑' : '↓'} {trend.label}
        </div>
      )}
      {hint && <div className="muted" style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>{hint}</div>}
    </div>
  );
}
