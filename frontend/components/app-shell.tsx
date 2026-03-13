import { ReactNode } from 'react';

type AppShellProps = {
  title: string;
  subtitle?: string;
  roleLabel?: string;
  kicker?: string;
  icon?: ReactNode;
  stats?: ReactNode;
  children: ReactNode;
};

export function AppShell({ title, subtitle, roleLabel, kicker, icon, stats, children }: AppShellProps) {
  return (
    <section className="page-shell stack">
      <header className="compact-header">
        {icon && <div className="compact-header-icon">{icon}</div>}
        <div className="compact-header-content">
          <div className="page-header-meta">
            <div className="pill">{roleLabel ? `${roleLabel} workspace` : 'TEMPA workspace'}</div>
            {kicker && <div className="page-kicker">{kicker}</div>}
          </div>
          <h1 className="compact-header-title">{title}</h1>
          {subtitle && <p className="compact-header-subtitle">{subtitle}</p>}
        </div>
        {stats && <div className="compact-header-stats">{stats}</div>}
      </header>
      {children}
    </section>
  );
}
