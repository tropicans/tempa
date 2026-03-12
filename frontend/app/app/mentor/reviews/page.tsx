import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { ReviewCard } from '@/components/review-card';
import { StatCard } from '@/components/stat-card';
import { fetchSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ProjectItem = {
  projectId: string;
  projectTitle: string;
  currentPhase: string;
  workflowState: string;
  participantUserId?: string;
};

function phaseToReviewHref(projectId: string, phase: string) {
  const map: Record<string, string> = {
    analysis: 'analysis-review',
    design: 'design-review',
    development: 'plan-review',
    implementation: 'plan-review',
    evaluation: 'evaluation-review',
  };
  return `/app/mentor/projects/${projectId}/${map[phase] ?? 'analysis-review'}`;
}

export default async function MentorReviewsPage() {
  const role = await getSessionRole();
  const response = await fetchSessionJson<{ items: ProjectItem[] }>('/projects').catch(() => ({ items: [] }));

  const reviewable = response.items.filter(
    (p) => ['submitted', 'under_review'].includes(p.workflowState),
  );
  const allProjects = response.items;

  return (
    <AppShell title="Review Queue" subtitle="Unified queue for analysis, design, planning, and evaluation reviews." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Mentor queue</div>
          <h2 className="hero-title">Lihat apa yang harus direview sekarang dan prioritaskan yang paling blocking.</h2>
          <p className="muted">Queue ini menampilkan submission yang membutuhkan keputusan mentor agar proyek peserta tetap bergerak.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Pending review</div><div className="metric-value">{reviewable.length}</div></div>
          <div className="metric-strip">
            <StatCard label="Total projects" value={allProjects.length} />
            <StatCard label="Submitted" value={allProjects.filter((p) => p.workflowState === 'submitted').length} />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Review flow" title="Pending reviews" description="Projects waiting for mentor action.">
          <div className="project-list">
            {reviewable.map((item) => (
              <ReviewCard
                key={item.projectId}
                title={item.projectTitle}
                phase={item.currentPhase}
                state={item.workflowState}
                description={`Participant ${item.participantUserId ?? 'unknown'} has submitted work in the ${item.currentPhase} phase.`}
                href={phaseToReviewHref(item.projectId, item.currentPhase)}
              />
            ))}
            {reviewable.length === 0 && <p className="muted">No submissions waiting for review.</p>}
          </div>
        </PageCard>
        <PageCard eyebrow="Queue principle" title="What makes this easy to use" description="A good review queue should help mentors decide what to open next at a glance.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><h3>Prioritize submitted work</h3><p className="muted">Surface the items that block participant progress first.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><h3>Keep labels consistent</h3><p className="muted">Phase names should mirror the participant workspace to reduce translation overhead.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><h3>Return here after every decision</h3><p className="muted">The queue should remain the clearest recovery point after a review action.</p></div></div>
          </div>
        </PageCard>
      </div>
      <PageCard eyebrow="All" title="All assigned projects" description="View any project to see full status.">
        <div className="project-list">
          {allProjects.map((item) => (
            <Link key={item.projectId} className="project-row" href={phaseToReviewHref(item.projectId, item.currentPhase)}>
              <strong>{item.projectTitle}</strong>
              <div className="project-meta">
                <span className="meta-chip">phase: {item.currentPhase}</span>
                <span className="meta-chip">state: {item.workflowState}</span>
                <span className="meta-chip">participant: {item.participantUserId ?? '–'}</span>
              </div>
            </Link>
          ))}
          {allProjects.length === 0 && <p className="muted">No projects assigned.</p>}
        </div>
      </PageCard>
    </AppShell>
  );
}
