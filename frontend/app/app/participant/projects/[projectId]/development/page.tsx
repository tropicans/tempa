import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ImplementationPlanData = {
  implementationPlanId?: string;
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

export default async function DevelopmentPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const plan = project.implementationPlan;

  async function savePlan(formData: FormData) {
    'use server';

    const roadmapText = String(formData.get('roadmap') ?? '').trim();
    const milestonesText = String(formData.get('milestones') ?? '').trim();
    const kpisText = String(formData.get('kpis') ?? '').trim();
    const risksText = String(formData.get('risks') ?? '').trim();

    const parseLines = (text: string) =>
      text.split('\n').map((line) => line.trim()).filter(Boolean);

    await postSessionJson(`/projects/${projectId}/implementation-plan`, {
      roadmap: parseLines(roadmapText),
      milestones: parseLines(milestonesText),
      kpis: parseLines(kpisText),
      risks: parseLines(risksText),
    });
    revalidatePath(`/app/participant/projects/${projectId}/development`);
  }

  async function submitPlan() {
    'use server';

    await postSessionJson(`/projects/${projectId}/implementation-plan/submit`);
    revalidatePath(`/app/participant/projects/${projectId}/development`);
    revalidatePath(`/app/participant/projects/${projectId}`);
  }

  const toLines = (data: unknown): string => {
    if (!Array.isArray(data)) return '';
    return data.map((item: unknown) => (typeof item === 'string' ? item : JSON.stringify(item))).join('\n');
  };

  return (
    <AppShell title="Development" subtitle={`Draft implementation roadmap, KPIs, and risk register for ${project.projectTitle}.`} roleLabel={role}>
      <PhaseWorkspace phase="Development" projectTitle={project.projectTitle} projectState={plan?.workflowState ?? project.workflowState}>
        <PageCard eyebrow="Plan" title="Implementation plan" description="Define your roadmap, milestones, KPIs, and risks. Editable in draft or revision states.">
          <form action={savePlan} className="stack">
            <label className="field">
              <span>Roadmap (one item per line)</span>
              <textarea name="roadmap" rows={4} defaultValue={toLines(plan?.roadmapJson)} placeholder="Phase 1: Stakeholder alignment&#10;Phase 2: Pilot launch&#10;Phase 3: Full rollout" />
            </label>
            <label className="field">
              <span>Milestones (one per line)</span>
              <textarea name="milestones" rows={4} defaultValue={toLines(plan?.milestoneJson)} placeholder="M1: Stakeholder mapping complete&#10;M2: Pilot launched&#10;M3: Impact report submitted" />
            </label>
            <label className="field">
              <span>KPIs (one per line)</span>
              <textarea name="kpis" rows={4} defaultValue={toLines(plan?.kpiJson)} placeholder="Service processing time reduced by 30%&#10;Citizen satisfaction > 85%" />
            </label>
            <label className="field">
              <span>Risk register (one per line)</span>
              <textarea name="risks" rows={4} defaultValue={toLines(plan?.riskRegisterJson)} placeholder="Stakeholder resistance to new process&#10;Budget constraints during pilot phase" />
            </label>
            <div className="actions">
              <button className="button" type="submit">Save plan</button>
              <button className="button secondary" formAction={submitPlan}>Submit for review</button>
            </div>
          </form>
        </PageCard>
        {plan?.reviewerComment && (
          <PageCard eyebrow="Feedback" title="Mentor review" description="Feedback from your mentor on the implementation plan.">
            <div className="signal-box">
              <strong>Reviewer comment</strong>
              <p>{plan.reviewerComment}</p>
            </div>
          </PageCard>
        )}
        <PageCard eyebrow="Checkpoint" title="What good looks like" description="Use this checklist before submitting for mentor review.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><b>Clear roadmap</b><p className="muted">Phased plan with realistic timelines.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><b>Measurable KPIs</b><p className="muted">Concrete metrics tied to the problem statement.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><b>Risk awareness</b><p className="muted">Key risks identified with mitigation strategies.</p></div></div>
          </div>
        </PageCard>
      </PhaseWorkspace>
    </AppShell>
  );
}
