import Link from 'next/link';
import { ReactNode } from 'react';

type AppShellProps = {
  title: string;
  subtitle?: string;
  roleLabel?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, roleLabel, children }: AppShellProps) {
  return (
    <main className="shell stack subtle-grid">
      <header className="card stack">
        <div className="stack" style={{ gap: 16 }}>
          <div className="pill">Live platform{roleLabel ? ` - ${roleLabel}` : ''}</div>
          <div className="brand-mark">tempa<span>ai</span></div>
        </div>
        <div>
          <h1 className="hero-title">{title}</h1>
          {subtitle ? <p className="muted">{subtitle}</p> : null}
        </div>
        <nav>
          <ul className="quick-list">
            <li><Link href="/login/as/participant">Participant</Link></li>
            <li><Link href="/login/as/mentor">Mentor</Link></li>
            <li><Link href="/login/as/program_admin">Admin</Link></li>
            <li><Link href="/login/as/executive_viewer">Executive</Link></li>
          </ul>
        </nav>
      </header>
      {children}
    </main>
  );
}
