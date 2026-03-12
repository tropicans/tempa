import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ImplementationPlanData = {
  roadmapJson?: unknown[];
  milestoneJson?: unknown[];
  kpiJson?: unknown[];
  riskRegisterJson?: unknown[];
  workflowState?: string;
  reviewerComment?: string;
};

type ProjectDetail = {
  projectId: string;
  projectTitle: string;
  currentPhase: string;
  workflowState: string;
  implementationPlan?: ImplementationPlanData;
};

export default async function PlanReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const plan = project.implementationPlan;

  const toItems = (data: unknown): string[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item: unknown) => (typeof item === 'string' ? item : JSON.stringify(item)));
  };

  async function reviewAction(formData: FormData) {
    'use server';

    const decision = String(formData.get('decision') ?? '');
    const reviewerComment = String(formData.get('reviewerComment') ?? '').trim();

    await postSessionJson(`/projects/${projectId}/implementation-plan/review`, {
      decision,
      reviewerComment: reviewerComment || undefined,
    });
    revalidatePath(`/app/mentor/projects/${projectId}/plan-review`);
    revalidatePath('/app/mentor/reviews');
    redirect('/app/mentor/reviews');
  }

  const milestones = toItems(plan?.milestoneJson);
  const kpis = toItems(plan?.kpiJson);
  const risks = toItems(plan?.riskRegisterJson);
  const roadmap = toItems(plan?.roadmapJson);

  return (
    <AppShell title="Implementation Plan Review" subtitle={`Review roadmap, milestones, KPIs, and risk controls for ${project.projectTitle}.`} roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Development gate</div>
          <h2 className="hero-title">Pastikan rencana implementasi cukup konkret untuk dieksekusi.</h2>
          <p className="muted">Periksa milestone, KPI, dan risk handling sebelum proyek masuk implementation mode.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">State</div><div className="metric-value">{plan?.workflowState ?? project.workflowState}</div></div>
          <div className="metric-strip">
            <StatCard label="Milestones" value={milestones.length} />
            <StatCard label="KPIs" value={kpis.length} />
            <StatCard label="Risks" value={risks.length} />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Blueprint" title="Plan content" description="Participant's roadmap, milestones, KPIs, and risk register.">
          <div className="stack">
            <div className="list-panel">
              <strong>Roadmap</strong>
              <ul className="plain-list">
                {roadmap.map((item, i) => <li key={i}>{item}</li>)}
                {roadmap.length === 0 && <li className="muted">No roadmap defined yet.</li>}
              </ul>
            </div>
            <div className="list-panel">
              <strong>Milestones</strong>
              <ul className="plain-list">
                {milestones.map((item, i) => <li key={i}>{item}</li>)}
                {milestones.length === 0 && <li className="muted">No milestones defined yet.</li>}
              </ul>
            </div>
            <div className="list-panel">
              <strong>KPIs</strong>
              <ul className="plain-list">
                {kpis.map((item, i) => <li key={i}>{item}</li>)}
                {kpis.length === 0 && <li className="muted">No KPIs defined yet.</li>}
              </ul>
            </div>
            <div className="list-panel">
              <strong>Risk register</strong>
              <ul className="plain-list">
                {risks.map((item, i) => <li key={i}>{item}</li>)}
                {risks.length === 0 && <li className="muted">No risks registered yet.</li>}
              </ul>
            </div>
          </div>
        </PageCard>
        <PageCard eyebrow="Decision" title="Review controls" description="Approve the implementation plan or request revision.">
          <form action={reviewAction} className="stack">
            <label className="field">
              <span>Comment (optional)</span>
              <textarea name="reviewerComment" rows={4} placeholder="Are milestones realistic? Do KPIs map to the problem?" />
            </label>
            <div className="actions">
              <button className="button" type="submit" name="decision" value="approved">✓ Approve plan</button>
              <button className="button secondary" type="submit" name="decision" value="revision_required">↩ Request revision</button>
            </div>
          </form>
          {plan?.reviewerComment && (
            <div className="signal-box" style={{ marginTop: '1rem' }}>
              <strong>Previous feedback</strong>
              <p>{plan.reviewerComment}</p>
            </div>
          )}
        </PageCard>
      </div>
    </AppShell>
  );
}
