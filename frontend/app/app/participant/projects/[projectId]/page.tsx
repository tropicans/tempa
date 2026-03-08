import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
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
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Project overview</div>
          <h2 className="hero-title">{project.projectTitle}</h2>
          <p className="muted">Lihat status proyek, mentor aktif, dan langkah berikutnya sebelum masuk ke workspace phase-by-phase.</p>
          <div className="hero-actions">
            <Link className="button" href={`/app/participant/projects/${projectId}/analysis`}>Open analysis</Link>
            <Link className="button secondary" href="/app/participant/projects">Back to projects</Link>
          </div>
        </div>
        <div className="metric-strip">
          <div className="metric-card">
            <div className="metric-label">Current phase</div>
            <div className="metric-value">{project.currentPhase}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Workflow state</div>
            <div className="metric-value">{project.workflowState}</div>
          </div>
        </div>
      </section>
      <PageCard eyebrow="Details" title="Live project detail" description="Live project detail from the backend starter API.">
        <div className="stack">
          <p><strong>Project ID:</strong> {project.projectId}</p>
          <p><strong>Current phase:</strong> {project.currentPhase}</p>
          <p><strong>Workflow state:</strong> {project.workflowState}</p>
          <p><strong>Mentor:</strong> {project.mentorUserId ?? 'Not assigned yet'}</p>
        </div>
      </PageCard>
      <PageCard eyebrow="Journey" title="Next actions" description="Move the project through the guided ADDIE workflow.">
        <div className="journey-list">
          <div className="journey-step"><strong>1</strong><div><b>Draft the problem</b><p className="muted">Capture the organizational context and current evidence.</p></div></div>
          <div className="journey-step"><strong>2</strong><div><b>Run AI assist</b><p className="muted">Use AI to sharpen framing, causes, and stakeholders.</p></div></div>
          <div className="journey-step"><strong>3</strong><div><b>Submit for mentor review</b><p className="muted">Lock the analysis foundation before moving to design.</p></div></div>
        </div>
      </PageCard>
    </AppShell>
  );
}
