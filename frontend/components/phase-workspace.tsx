'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type PhaseWorkspaceProps = {
  phase: string;
  projectTitle?: string;
  projectState?: string;
  children: ReactNode;
};

const phaseLinks = [
  { href: 'analysis', label: 'Analysis' },
  { href: 'design', label: 'Design' },
  { href: 'development', label: 'Development' },
  { href: 'implementation', label: 'Implementation' },
  { href: 'evaluation', label: 'Evaluation' },
];

export function PhaseWorkspace({ phase, projectTitle, projectState, children }: PhaseWorkspaceProps) {
  const pathname = usePathname();
  const basePath = pathname.split('/').slice(0, -1).join('/');

  return (
    <div className="stack">
      <section className="status-banner">
        <div className="pill">{phase}</div>
        <strong>{projectTitle ?? 'Project workspace'}</strong>
        <span className="meta-chip">state: {projectState ?? 'draft'}</span>
      </section>
      <div className="workspace">
        <aside className="card stack">
          <div className="section-eyebrow">Workspace</div>
          <h3>Project phases</h3>
          <p className="muted">Move from diagnosis to evidence-backed evaluation with a visible next step at every phase.</p>
          <ul className="nav-list">
            <li>
              <Link className={`nav-link${pathname === basePath ? ' is-active' : ''}`} href={basePath}>
                Overview
              </Link>
            </li>
            {phaseLinks.map((item, index) => {
              const href = `${basePath}/${item.href}`;
              const active = pathname === href;

              return (
                <li key={item.href}>
                  <Link className={`nav-link${active ? ' is-active' : ''}`} href={href}>
                    <span>{item.label}</span>
                    <span className="nav-step-index">0{index + 1}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
        <div className="stack">{children}</div>
        <aside className="card stack">
          <div className="pill">{phase}</div>
          <div>
            <h3>Decision support</h3>
            <p className="muted">Suggestions, sources, and mentor notes should stay near the work without crowding the main canvas.</p>
          </div>
          <div className="signal-box">
            <strong>Recommended rhythm</strong>
            <p className="muted">Draft manually first, use AI to sharpen structure, then submit for mentor validation.</p>
          </div>
          <div className="metric-card">
            <div className="metric-label">Navigation goal</div>
            <div className="metric-value">Stay oriented</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
