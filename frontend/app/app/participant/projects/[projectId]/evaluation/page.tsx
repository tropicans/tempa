import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ReflectionData = {
  reflectionId?: string;
  reflectionText?: string;
  aiSummary?: string;
  workflowState?: string;
};

type TaiScoreData = {
  problemComplexityScore?: number;
  decisionQualityScore?: number;
  impactScore?: number;
  reflectiveMaturityScore?: number;
  totalTaiScore?: number;
  publishedFlag?: boolean;
};

type ProjectDetail = {
  projectId: string;
  projectTitle: string;
  currentPhase: string;
  workflowState: string;
  reflection?: ReflectionData;
  taiScore?: TaiScoreData;
};

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const reflection = project.reflection;
  const taiScore = project.taiScore;

  async function saveReflection(formData: FormData) {
    'use server';

    const reflectionText = String(formData.get('reflectionText') ?? '').trim();
    if (!reflectionText) return;

    await postSessionJson(`/projects/${projectId}/reflections`, { reflectionText });
    revalidatePath(`/app/participant/projects/${projectId}/evaluation`);
  }

  async function submitReflection() {
    'use server';

    await postSessionJson(`/projects/${projectId}/reflections/submit`);
    revalidatePath(`/app/participant/projects/${projectId}/evaluation`);
    revalidatePath(`/app/participant/projects/${projectId}`);
  }

  async function runReflectionAI() {
    'use server';

    await postSessionJson(`/projects/${projectId}/reflection-analysis:ai`);
    revalidatePath(`/app/participant/projects/${projectId}/evaluation`);
  }

  return (
    <AppShell title="Evaluation" subtitle={`Submit reflection and review TAI score for ${project.projectTitle}.`} roleLabel={role}>
      <PhaseWorkspace phase="Evaluation" projectTitle={project.projectTitle} projectState={reflection?.workflowState ?? project.workflowState}>
        <PageCard eyebrow="Reflect" title="Reflection journal" description="Write about what you learned, challenges faced, and growth during this project.">
          <form action={saveReflection} className="stack">
            <label className="field">
              <span>Reflection text</span>
              <textarea
                name="reflectionText"
                rows={8}
                defaultValue={reflection?.reflectionText ?? ''}
                placeholder="Reflect on your experience: What worked well? What would you do differently? What did you learn about leadership and problem-solving?"
              />
            </label>
            <div className="actions">
              <button className="button" type="submit">Save reflection</button>
              <button className="button secondary" formAction={runReflectionAI}>Run AI analysis</button>
              <button className="button secondary" formAction={submitReflection}>Submit for review</button>
            </div>
          </form>
        </PageCard>

        {reflection?.aiSummary && (
          <PageCard eyebrow="AI output" title="Reflection analysis" description="AI-generated summary and maturity indicators.">
            <div className="signal-box">
              <strong>AI Summary</strong>
              <p>{reflection.aiSummary}</p>
            </div>
          </PageCard>
        )}

        <PageCard eyebrow="Score" title="TAI score" description="Thinking Acuity Index — a composite score across four dimensions.">
          {taiScore ? (
            <div className="stack">
              <div className="metric-strip">
                <div className="metric-card">
                  <div className="metric-label">Problem Complexity</div>
                  <div className="metric-value">{taiScore.problemComplexityScore ?? 0}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Decision Quality</div>
                  <div className="metric-value">{taiScore.decisionQualityScore ?? 0}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Impact</div>
                  <div className="metric-value">{taiScore.impactScore ?? 0}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Reflective Maturity</div>
                  <div className="metric-value">{taiScore.reflectiveMaturityScore ?? 0}</div>
                </div>
              </div>
              <div className="signal-box" style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '1.5rem' }}>Total TAI: {taiScore.totalTaiScore ?? 0}</strong>
                {taiScore.publishedFlag && <p className="muted">Published ✓</p>}
              </div>
            </div>
          ) : (
            <p className="muted">TAI score will be calculated after mentor assessment is completed.</p>
          )}
        </PageCard>

        <PageCard eyebrow="Checkpoint" title="Evaluation readiness" description="Ensure these are complete before your mentor finalizes the assessment.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><b>Honest reflection</b><p className="muted">Self-aware analysis of strengths and areas for growth.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><b>Evidence linked</b><p className="muted">Impact metrics tied to concrete project outcomes.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><b>Mentor discussion</b><p className="muted">Discussion with mentor to calibrate learning takeaways.</p></div></div>
          </div>
        </PageCard>
      </PhaseWorkspace>
    </AppShell>
  );
}
