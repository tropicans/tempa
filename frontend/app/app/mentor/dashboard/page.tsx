import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { fetchSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ProjectItem = {
  projectId: string;
  projectTitle: string;
  currentPhase: string;
  workflowState: string;
  participantUserId?: string;
};

type DashboardSummary = {
  assignedParticipantCount: number;
  pendingReviewCount: number;
  totalProjects: number;
  averageTaiScore: number;
};

export default async function MentorDashboardPage() {
  const role = await getSessionRole();
  const summary = await fetchSessionJson<DashboardSummary>('/dashboards/summary').catch(() => ({
    assignedParticipantCount: 0,
    pendingReviewCount: 0,
    totalProjects: 0,
    averageTaiScore: 0,
  }));
  const response = await fetchSessionJson<{ items: ProjectItem[] }>('/projects').catch(() => ({ items: [] }));
  const projects = response.items;

  return (
    <AppShell title="Mentor Dashboard" subtitle="Monitor assigned participants and pending reviews." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Mentor cockpit</div>
          <h2 className="hero-title">Jaga kualitas keputusan peserta di setiap checkpoint.</h2>
          <p className="muted">Mentor workspace dirancang untuk cepat membaca submission, memberi feedback, dan menjaga alur tetap bergerak.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-card"><div className="metric-label">Assigned participants</div><div className="metric-value">{summary.assignedParticipantCount}</div></div>
          <div className="metric-card"><div className="metric-label">Pending review</div><div className="metric-value">{summary.pendingReviewCount}</div></div>
          <div className="metric-card"><div className="metric-label">Total projects</div><div className="metric-value">{summary.totalProjects}</div></div>
          <div className="metric-card"><div className="metric-label">Avg TAI</div><div className="metric-value">{Math.round(summary.averageTaiScore)}</div></div>
        </div>
      </section>
      <PageCard eyebrow="Queue" title="Assigned projects" description="Active projects assigned to you as mentor.">
        <div className="project-list">
          {projects.map((item) => (
            <Link key={item.projectId} className="project-row" href={`/app/mentor/projects/${item.projectId}/analysis-review`}>
              <strong>{item.projectTitle}</strong>
              <div className="project-meta">
                <span className="meta-chip">phase: {item.currentPhase}</span>
                <span className="meta-chip">state: {item.workflowState}</span>
                <span className="meta-chip">participant: {item.participantUserId ?? '–'}</span>
              </div>
            </Link>
          ))}
          {projects.length === 0 && <p className="muted">No projects assigned.</p>}
        </div>
      </PageCard>
    </AppShell>
  );
}
