'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardCheck,
  Users,
  Settings,
  Shield,
  BarChart3,
  Activity,
  FileSearch,
  Briefcase,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from './theme-provider';
import { ReactNode } from 'react';

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  match?: string[];
};

const iconSize = 18;

const navByRole: Record<string, NavItem[]> = {
  participant: [
    { href: '/app/participant/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={iconSize} /> },
    { href: '/app/participant/projects', label: 'Projects', icon: <FolderKanban size={iconSize} /> },
  ],
  mentor: [
    { href: '/app/mentor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={iconSize} /> },
    { href: '/app/mentor/reviews', label: 'Review Queue', icon: <ClipboardCheck size={iconSize} />, match: ['/app/mentor/projects'] },
  ],
  program_admin: [
    { href: '/app/admin/programs', label: 'Programs', icon: <Briefcase size={iconSize} /> },
    { href: '/app/admin/cohorts/demo-cohort', label: 'Cohorts', icon: <Users size={iconSize} />, match: ['/app/admin/cohorts'] },
    { href: '/app/admin/rubrics', label: 'Rubrics', icon: <FileSearch size={iconSize} /> },
  ],
  executive_viewer: [
    { href: '/app/executive/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={iconSize} /> },
    { href: '/app/executive/programs', label: 'Programs', icon: <Briefcase size={iconSize} /> },
    { href: '/app/executive/projects', label: 'Portfolio', icon: <BarChart3 size={iconSize} /> },
  ],
  platform_operator: [
    { href: '/app/platform/monitoring', label: 'Monitoring', icon: <Activity size={iconSize} /> },
    { href: '/app/platform/audit', label: 'Audit', icon: <Shield size={iconSize} /> },
    { href: '/app/platform/config', label: 'Config', icon: <Settings size={iconSize} /> },
  ],
};

const roleLabels: Record<string, string> = {
  participant: 'Participant',
  mentor: 'Mentor',
  program_admin: 'Program Admin',
  executive_viewer: 'Executive',
  platform_operator: 'Operator',
};

function isActive(pathname: string, item: NavItem) {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return item.match?.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ?? false;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

type SidebarProps = {
  role: string;
  fullName: string;
};

export function Sidebar({ role, fullName }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const navItems = navByRole[role] ?? navByRole.participant;
  const roleLabel = roleLabels[role] ?? 'Workspace';

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <div className="app-brand-block">
        <Link className="brand-mark brand-mark-large" href="/app">
          tempa<span>ai</span>
        </Link>
      </div>

      {/* Workspace chip */}
      <div className="sidebar-section">
        <div className="workspace-chip">{roleLabel} workspace</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-section" aria-label="Primary navigation">
        <div className="sidebar-label">Navigate</div>
        <div className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className={`sidebar-link${isActive(pathname, item) ? ' is-active' : ''}`}
              href={item.href}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="nav-link-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        {/* Theme toggle */}
        <button
          type="button"
          className="sidebar-link"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%' }}
        >
          {theme === 'dark' ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>

        {/* Profile */}
        <div className="profile-card">
          <div className="profile-avatar">{getInitials(fullName)}</div>
          <div className="profile-info">
            <div className="profile-name">{fullName}</div>
            <div className="profile-role">{roleLabel}</div>
          </div>
          <a className="icon-button" href="/logout" title="Log out">
            <LogOut size={16} />
          </a>
        </div>
      </div>
    </aside>
  );
}

type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {i > 0 && <ChevronRight size={14} className="breadcrumb-separator" />}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
