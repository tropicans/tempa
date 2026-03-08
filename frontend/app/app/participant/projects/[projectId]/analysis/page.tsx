import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ProblemStatement = {
  problemId?: string;
  rawProblemText?: string;
  reframedProblemText?: string;
  rootCauses?: string[];
  stakeholders?: string[];
  workflowState?: string;
  confidenceScore?: number;
  reviewerComment?: string;
};

type ProjectDetail = {
  projectId: string;
  projectTitle: string;
  workflowState: string;
  problemStatement?: ProblemStatement;
};

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const problem = project.problemStatement ?? {};

  async function saveProblemStatement(formData: FormData) {
    'use server';

    const rawProblemText = String(formData.get('rawProblemText') ?? '').trim();
    if (!rawProblemText) {
      return;
    }
    await postSessionJson(`/projects/${projectId}/problem-statement`, { rawProblemText });
    revalidatePath(`/app/participant/projects/${projectId}/analysis`);
  }

  async function runAiAnalysis() {
    'use server';

    await postSessionJson(`/projects/${projectId}/problem-analysis:ai`);
    revalidatePath(`/app/participant/projects/${projectId}/analysis`);
  }

  async function submitProblemStatement() {
    'use server';

    await postSessionJson(`/projects/${projectId}/problem-statement/submit`);
    revalidatePath(`/app/participant/projects/${projectId}/analysis`);
    revalidatePath(`/app/participant/projects/${projectId}`);
  }

  return (
    <AppShell title="Analysis" subtitle={`Draft problem statements and run AI-assisted diagnosis for ${project.projectTitle}.`} roleLabel={role}>
      <PhaseWorkspace phase="Analysis" projectTitle={project.projectTitle} projectState={problem.workflowState ?? project.workflowState}>
        <PageCard eyebrow="Draft" title="Problem statement" description="Editable only in draft or revision-required states.">
          <form action={saveProblemStatement} className="stack">
            <label className="field">
              <span>Raw problem statement</span>
              <textarea
                name="rawProblemText"
                rows={8}
                defaultValue={problem.rawProblemText ?? ''}
                placeholder="Describe the organizational problem, context, and evidence."
              />
            </label>
            <div className="actions">
              <button className="button" type="submit">Save draft</button>
              <button className="button secondary" formAction={runAiAnalysis}>Run AI assist</button>
              <button className="button secondary" formAction={submitProblemStatement}>Submit for review</button>
            </div>
          </form>
        </PageCard>
        <PageCard eyebrow="AI output" title="Diagnostic report" description="AI reframing, root causes, stakeholders, and competency gaps.">
          <div className="stack">
            <p><strong>Workflow state:</strong> {problem.workflowState ?? project.workflowState}</p>
            <p><strong>Reframed problem:</strong> {problem.reframedProblemText ?? 'No AI reframing yet.'}</p>
            <p><strong>Confidence:</strong> {problem.confidenceScore ?? 'N/A'}</p>
            <div>
              <strong>Root causes</strong>
              <ul className="quick-list">
                {(problem.rootCauses ?? []).map((item) => <li key={item}>{item}</li>)}
                {(problem.rootCauses ?? []).length === 0 ? <li className="muted">No root causes generated yet.</li> : null}
              </ul>
            </div>
            <div>
              <strong>Stakeholders</strong>
              <ul className="quick-list">
                {(problem.stakeholders ?? []).map((item) => <li key={item}>{item}</li>)}
                {(problem.stakeholders ?? []).length === 0 ? <li className="muted">No stakeholders generated yet.</li> : null}
              </ul>
            </div>
          </div>
        </PageCard>
        <PageCard eyebrow="Mentor checkpoint" title="What good looks like" description="Use this checklist before submitting for mentor review.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><b>Specific problem statement</b><p className="muted">Clear scope, context, and current pain point.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><b>Root-cause quality</b><p className="muted">Not only symptoms, but drivers of the issue.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><b>Stakeholder coverage</b><p className="muted">Capture who is affected and who can enable change.</p></div></div>
          </div>
        </PageCard>
      </PhaseWorkspace>
    </AppShell>
  );
}
