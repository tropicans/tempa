import Link from 'next/link';
import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
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
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Participant workspace</div>
          <h2 className="hero-title">Mulai proyek baru atau lanjutkan yang sudah berjalan.</h2>
          <p className="muted">Setiap proyek di TEMPA menjadi wadah dari problem framing sampai evidence dan TAI.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-card">
            <div className="metric-label">Visible projects</div>
            <div className="metric-value">{response.items.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Current default cohort</div>
            <div className="metric-value">demo-cohort</div>
          </div>
        </div>
      </section>
      <PageCard eyebrow="Create" title="New project" description="Starter participant action wired to the backend create-project endpoint.">
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
      <PageCard eyebrow="Workspace" title="Project list" description="Starter list wired to the backend project endpoint.">
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
          {response.items.length === 0 ? <p className="muted">No visible projects yet.</p> : null}
        </div>
      </PageCard>
    </AppShell>
  );
}
