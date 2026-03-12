'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type AppFrameProps = {
  role: string;
  fullName: string;
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  match?: string[];
};

const navByRole: Record<string, NavItem[]> = {
  participant: [
    { href: '/app/participant/dashboard', label: 'Dashboard' },
    { href: '/app/participant/projects', label: 'Projects' },
  ],
  mentor: [
    { href: '/app/mentor/dashboard', label: 'Dashboard' },
    { href: '/app/mentor/reviews', label: 'Review Queue', match: ['/app/mentor/projects'] },
  ],
  program_admin: [
    { href: '/app/admin/programs', label: 'Programs' },
    { href: '/app/admin/cohorts/demo-cohort', label: 'Cohorts', match: ['/app/admin/cohorts'] },
    { href: '/app/admin/rubrics', label: 'Rubrics' },
  ],
  executive_viewer: [
    { href: '/app/executive/dashboard', label: 'Dashboard' },
    { href: '/app/executive/programs', label: 'Programs' },
    { href: '/app/executive/projects', label: 'Portfolio' },
  ],
  platform_operator: [
    { href: '/app/platform/monitoring', label: 'Monitoring' },
    { href: '/app/platform/audit', label: 'Audit' },
    { href: '/app/platform/config', label: 'Config' },
  ],
};

const roleLabels: Record<string, string> = {
  participant: 'Participant workspace',
  mentor: 'Mentor workspace',
  program_admin: 'Program operations',
  executive_viewer: 'Executive view',
  platform_operator: 'Platform operations',
};

function isActive(pathname: string, item: NavItem) {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
    return true;
  }

  return item.match?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ?? false;
}

export function AppFrame({ role, fullName, children }: AppFrameProps) {
  const pathname = usePathname();
  const navItems = navByRole[role] ?? navByRole.participant;
  const roleLabel = roleLabels[role] ?? 'Workspace';

  return (
    <div className="app-frame-shell subtle-grid">
      <div className="app-frame">
        <aside className="app-sidebar">
          <div className="app-brand-block">
            <Link className="brand-mark brand-mark-large" href="/app">
              tempa<span>ai</span>
            </Link>
            <p className="sidebar-copy muted">
              Structured execution workspace for participants, mentors, operators, and leadership.
            </p>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Workspace</div>
            <div className="workspace-chip">{roleLabel}</div>
          </div>

          <nav className="sidebar-section" aria-label="Primary">
            <div className="sidebar-label">Navigate</div>
            <div className="sidebar-nav">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={`sidebar-link${isActive(pathname, item) ? ' is-active' : ''}`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="profile-card">
              <div>
                <div className="sidebar-label">Signed in as</div>
                <strong>{fullName}</strong>
              </div>
              <a className="ghost-link" href="/logout">
                Log out
              </a>
            </div>
          </div>
        </aside>

        <div className="app-content-shell">
          <div className="app-topbar">
            <div>
              <div className="sidebar-label">TEMPA workspace</div>
              <div className="topbar-title">{roleLabel}</div>
            </div>
            <div className="topbar-note muted">Focused views, cleaner handoffs, and faster stakeholder navigation.</div>
          </div>
          <div className="app-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
