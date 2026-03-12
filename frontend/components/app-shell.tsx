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
        {/* Use <a> tags (not <Link>) for route handlers to prevent Next.js prefetch
            which would trigger the route handler and corrupt session cookies */}
        <nav>
          <ul className="quick-list">
            <li><a href="/login/as/participant">Participant</a></li>
            <li><a href="/login/as/mentor">Mentor</a></li>
            <li><a href="/login/as/program_admin">Admin</a></li>
            <li><a href="/login/as/executive_viewer">Executive</a></li>
            <li style={{ opacity: 0.5 }}>|</li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </nav>
      </header>
      {children}
    </main>
  );
}
