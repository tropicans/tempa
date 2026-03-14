import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { fetchSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ProjectDetail = {
  projectId: string;
  projectTitle: string;
  currentPhase: string;
  workflowState: string;
  participantUserId?: string;
  mentorUserId?: string;
};

export default async function ParticipantProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);

  return (
    <AppShell title="Project Overview" subtitle="Summary of project status, mentor assignment, and evidence health." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Project overview</div>
          <h2 className="hero-title">{project.projectTitle}</h2>
          <p className="muted">Lihat status proyek, mentor aktif, dan langkah berikutnya sebelum masuk ke workspace phase-by-phase.</p>
          <div className="hero-actions">
            <Link className="button" href={`/app/participant/projects/${projectId}/analysis`}>Open analysis</Link>
            <Link className="button secondary" href="/app/participant/projects">Back to projects</Link>
          </div>
        </div>
        <div className="hero-panel-surface stack">
          <AccentCard label="Current phase" value={project.currentPhase} />
          <div className="metric-strip">
            <StatCard label="Workflow state" value={project.workflowState} />
            <StatCard label="Mentor" value={project.mentorUserId ?? 'Pending'} />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Details" title="Live project detail" description="Current delivery context from the backend workspace record.">
          <div className="kv-list">
            <div className="kv-row"><span className="kv-key">Project ID</span><strong>{project.projectId}</strong></div>
            <div className="kv-row"><span className="kv-key">Current phase</span><strong>{project.currentPhase}</strong></div>
            <div className="kv-row"><span className="kv-key">Workflow state</span><strong>{project.workflowState}</strong></div>
            <div className="kv-row"><span className="kv-key">Mentor</span><strong>{project.mentorUserId ?? 'Not assigned yet'}</strong></div>
          </div>
        </PageCard>
        <PageCard eyebrow="Journey" title="Next actions" description="Move the project through the guided delivery rhythm with less navigation friction.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><h3>Draft the problem</h3><p className="muted">Capture the organizational context and the evidence behind the issue.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><h3>Use AI only to sharpen</h3><p className="muted">Start manually, then refine framing, causes, and stakeholder coverage.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><h3>Submit for mentor review</h3><p className="muted">Lock the analysis foundation before moving into design decisions.</p></div></div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
