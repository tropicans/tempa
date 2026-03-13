import Link from 'next/link';
import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ProjectItem = {
  projectId: string;
  projectTitle: string;
  currentPhase: string;
  workflowState: string;
};

export default async function ParticipantProjectsPage() {
  const role = await getSessionRole();
  const response = await fetchSessionJson<{ items: ProjectItem[] }>('/projects').catch(() => ({ items: [] }));

  async function createProject(formData: FormData) {
    'use server';

    const projectTitle = String(formData.get('projectTitle') ?? '').trim();
    const cohortId = String(formData.get('cohortId') ?? 'demo-cohort').trim() || 'demo-cohort';

    if (!projectTitle) {
      return;
    }

    await postSessionJson('/projects', { projectTitle, cohortId });
    revalidatePath('/app/participant/projects');
    revalidatePath('/app/participant/dashboard');
  }

  return (
    <AppShell title="My Projects" subtitle="List active and completed participant projects." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Participant workspace</div>
          <h2 className="hero-title">Mulai proyek baru atau lanjutkan yang sudah berjalan.</h2>
          <p className="muted">Setiap proyek di TEMPA menjadi wadah dari problem framing sampai evidence dan TAI.</p>
        </div>
        <div className="hero-panel-surface stack">
          <AccentCard label="Visible projects" value={response.items.length} />
          <div className="metric-strip">
            <StatCard label="Current cohort" value="demo-cohort" />
            <StatCard label="Workspace model" value="Phase-based" />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Create" title="Start a new project" description="Keep the create flow lightweight so participants can enter the workspace quickly.">
          <form action={createProject} className="stack">
            <label className="field">
              <span>Project title</span>
              <input name="projectTitle" placeholder="e.g. Digital Permit Service Improvement" required />
            </label>
            <label className="field">
              <span>Cohort ID</span>
              <input name="cohortId" defaultValue="demo-cohort" />
            </label>
            <div className="actions">
              <button className="button" type="submit">Create project</button>
            </div>
          </form>
        </PageCard>
        <PageCard eyebrow="Workflow" title="How to use this area" description="The project list should help participants decide what to continue, not overwhelm them.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><h3>Create or open one active project</h3><p className="muted">Use a single project workspace as the anchor for all deliverables.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><h3>Work through phases in order</h3><p className="muted">Each phase screen keeps actions, evidence, and guidance in one place.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><h3>Return here for overview</h3><p className="muted">This list remains the simplest way to resume work later.</p></div></div>
          </div>
        </PageCard>
      </div>
      <PageCard eyebrow="Workspace" title="Project list" description="Live participant projects with a simpler read of phase and workflow state.">
        <div className="project-list">
          {response.items.map((project) => (
            <Link key={project.projectId} className="project-row" href={`/app/participant/projects/${project.projectId}`}>
              <strong>{project.projectTitle}</strong>
              <div className="project-meta">
                <span className="meta-chip">phase: {project.currentPhase}</span>
                <span className="meta-chip">state: {project.workflowState}</span>
              </div>
            </Link>
          ))}
          {response.items.length === 0 && <p className="muted">No visible projects yet.</p>}
        </div>
      </PageCard>
    </AppShell>
  );
}
