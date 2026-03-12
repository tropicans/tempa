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
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Mentor queue</div>
          <h2 className="hero-title">Lihat apa yang harus direview sekarang dan prioritaskan yang paling blocking.</h2>
          <p className="muted">Queue ini menampilkan submission yang membutuhkan keputusan mentor agar proyek peserta tetap bergerak.</p>
        </div>
        <div className="metric-strip">
          <StatCard label="Total projects" value={allProjects.length} />
          <StatCard label="Pending review" value={reviewable.length} />
          <StatCard label="Submitted" value={allProjects.filter((p) => p.workflowState === 'submitted').length} />
        </div>
      </section>
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
