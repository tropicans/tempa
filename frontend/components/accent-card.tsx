type AccentCardProps = {
  label: string;
  value: string | number;
};

export function AccentCard({ label, value }: AccentCardProps) {
  return (
    <div className="metric-card accent-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}
