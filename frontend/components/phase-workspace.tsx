import Link from 'next/link';
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
        <h3>Project Phases</h3>
        <p className="muted">Move from diagnosis to evidence-backed evaluation with clear mentor checkpoints.</p>
        <ul className="nav-list">
          {phaseLinks.map((item) => (
            <li key={item.href}>
              <Link className="nav-link" href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        </aside>
        <div className="stack">{children}</div>
        <aside className="card stack">
          <div className="pill">{phase}</div>
          <div>
            <h3>AI Assist</h3>
            <p className="muted">Suggestions, sources, and mentor notes will appear here.</p>
          </div>
          <div className="signal-box">
            <strong>Recommended rhythm</strong>
            <p className="muted">Draft manually first, use AI to sharpen structure, then submit for mentor validation.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
