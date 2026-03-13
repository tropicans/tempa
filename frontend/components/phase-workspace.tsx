'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Search, Lightbulb, Code2, Rocket, BarChart3, Sparkles } from 'lucide-react';
import { ProgressStepper } from './progress-stepper';

type PhaseWorkspaceProps = {
  phase: string;
  projectTitle?: string;
  projectState?: string;
  children: ReactNode;
};

const phaseLinks = [
  { href: 'analysis', label: 'Analysis', icon: <Search size={16} /> },
  { href: 'design', label: 'Design', icon: <Lightbulb size={16} /> },
  { href: 'development', label: 'Development', icon: <Code2 size={16} /> },
  { href: 'implementation', label: 'Implementation', icon: <Rocket size={16} /> },
  { href: 'evaluation', label: 'Evaluation', icon: <BarChart3 size={16} /> },
];

export function PhaseWorkspace({ phase, projectTitle, projectState, children }: PhaseWorkspaceProps) {
  const pathname = usePathname();
  const basePath = pathname.split('/').slice(0, -1).join('/');

  return (
    <div className="stack" style={{ gap: '16px' }}>
      {/* Progress stepper at top */}
      <ProgressStepper
        currentPhase={phase.toLowerCase()}
        basePath={basePath}
      />

      {/* Status banner */}
      <section className="status-banner">
        <div className="pill">{phase}</div>
        <strong>{projectTitle ?? 'Project workspace'}</strong>
        <span className="meta-chip">state: {projectState ?? 'draft'}</span>
      </section>

      {/* 3-column workspace */}
      <div className="workspace">
        <aside className="card card-compact stack">
          <div className="section-eyebrow">Workspace</div>
          <h3 style={{ fontSize: 'var(--text-lg)' }}>Project phases</h3>
          <ul className="nav-list">
            <li>
              <Link className={`nav-link${pathname === basePath ? ' is-active' : ''}`} href={basePath}>
                <FolderIcon />
                <span>Overview</span>
              </Link>
            </li>
            {phaseLinks.map((item, index) => {
              const href = `${basePath}/${item.href}`;
              const active = pathname === href;
              return (
                <li key={item.href}>
                  <Link className={`nav-link${active ? ' is-active' : ''}`} href={href}>
                    {item.icon}
                    <span>{item.label}</span>
                    <span className="nav-step-index">0{index + 1}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="stack">{children}</div>

        <aside className="card card-compact stack">
          <div className="pill">{phase}</div>
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Decision support
              </span>
            </h3>
            <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>
              AI suggestions and mentor notes appear here alongside your work.
            </p>
          </div>
          <div className="signal-box">
            <strong style={{ fontSize: 'var(--text-base)' }}>Recommended rhythm</strong>
            <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>
              Draft manually first, use AI to sharpen, then submit for mentor validation.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
    </svg>
  );
}
