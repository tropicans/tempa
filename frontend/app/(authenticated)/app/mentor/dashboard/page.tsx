import Link from 'next/link';
import { LayoutDashboard, ClipboardCheck, Users, Target } from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { EmptyState } from '@/components/empty-state';
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
    <AppShell
      title="Mentor Dashboard"
      subtitle="Monitor assigned participants and pending reviews."
      roleLabel={role}
      icon={<LayoutDashboard size={22} />}
      stats={
        <>
          <div className="compact-stat">
            <div className="compact-stat-value">{summary.pendingReviewCount}</div>
            <div className="compact-stat-label">Pending</div>
          </div>
          <div className="compact-stat">
            <div className="compact-stat-value">{summary.totalProjects}</div>
            <div className="compact-stat-label">Projects</div>
          </div>
          <div className="compact-stat">
            <div className="compact-stat-value">{Math.round(summary.averageTaiScore)}</div>
            <div className="compact-stat-label">Avg TAI</div>
          </div>
        </>
      }
    >
      <div className="metric-strip">
        <AccentCard label="Pending review" value={summary.pendingReviewCount} />
        <StatCard label="Assigned participants" value={summary.assignedParticipantCount} icon={<Users size={16} />} />
        <StatCard label="Total projects" value={summary.totalProjects} icon={<ClipboardCheck size={16} />} />
        <StatCard label="Avg TAI" value={Math.round(summary.averageTaiScore)} icon={<Target size={16} />} />
      </div>

      <div className="grid grid-2">
        <PageCard eyebrow="Queue" title="Assigned projects" description="Active projects assigned to you.">
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
            {projects.length === 0 && (
              <EmptyState
                icon={<ClipboardCheck size={24} />}
                title="No projects assigned"
                description="Projects will appear here once participants are assigned to you."
              />
            )}
          </div>
        </PageCard>

        <PageCard eyebrow="Review rhythm" title="How to review effectively" description="A simpler review experience helps you focus on decision quality.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><h3 style={{ fontSize: 'var(--text-base)' }}>Scan queue quickly</h3><p className="muted" style={{ fontSize: 'var(--text-sm)' }}>Prioritize by phase and workflow state.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><h3 style={{ fontSize: 'var(--text-base)' }}>Open one focused review</h3><p className="muted" style={{ fontSize: 'var(--text-sm)' }}>Keep context, evidence, and feedback together.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><h3 style={{ fontSize: 'var(--text-base)' }}>Return to queue</h3><p className="muted" style={{ fontSize: 'var(--text-sm)' }}>Navigation always makes the next review obvious.</p></div></div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
