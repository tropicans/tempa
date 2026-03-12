import { ReactNode } from 'react';

type AppShellProps = {
  title: string;
  subtitle?: string;
  roleLabel?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, roleLabel, children }: AppShellProps) {
  return (
    <section className="page-shell stack">
      <header className="page-header card stack">
        <div className="page-header-meta">
          <div className="pill">{roleLabel ? `${roleLabel} workspace` : 'TEMPA workspace'}</div>
          <div className="page-kicker">Operational clarity for every stakeholder</div>
        </div>
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}
