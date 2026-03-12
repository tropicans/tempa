import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ReflectionData = {
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
  participantUserId?: string;
  reflection?: ReflectionData;
  taiScore?: TaiScoreData;
};

export default async function EvaluationReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const reflection = project.reflection;
  const taiScore = project.taiScore;

  async function submitAssessment(formData: FormData) {
    'use server';

    const problemComplexityScore = Number(formData.get('problemComplexityScore') ?? 0);
    const decisionQualityScore = Number(formData.get('decisionQualityScore') ?? 0);
    const impactScore = Number(formData.get('impactScore') ?? 0);
    const reflectiveMaturityScore = Number(formData.get('reflectiveMaturityScore') ?? 0);
    const assessorComment = String(formData.get('assessorComment') ?? '').trim();

    await postSessionJson(`/projects/${projectId}/assessments`, {
      problemComplexityScore,
      decisionQualityScore,
      impactScore,
      reflectiveMaturityScore,
      assessorComment: assessorComment || undefined,
    });
    revalidatePath(`/app/mentor/projects/${projectId}/evaluation-review`);
  }

  async function publishTai() {
    'use server';

    await postSessionJson(`/projects/${projectId}/tai-score`);
    revalidatePath(`/app/mentor/projects/${projectId}/evaluation-review`);
    revalidatePath('/app/mentor/reviews');
  }

  return (
    <AppShell title="Evaluation Review" subtitle={`Final assessment and TAI publication for ${project.projectTitle}.`} roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Final review</div>
          <h2 className="hero-title">Gabungkan reflection, evidence, dan judgment mentor ke hasil akhir yang kredibel.</h2>
          <p className="muted">Di tahap ini mentor menilai kedewasaan refleksi dan kesiapan publikasi skor TAI.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">TAI score</div><div className="metric-value">{taiScore?.totalTaiScore ?? '–'}</div></div>
          <div className="metric-strip">
            <StatCard label="Reflection" value={reflection?.workflowState ?? 'pending'} />
            <StatCard label="Published" value={taiScore?.publishedFlag ? 'Yes' : 'No'} />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Reflection" title="Participant reflection" description="Review the participant's self-reflection and AI analysis.">
          <div className="stack">
            <div className="list-panel">
              <strong>Reflection</strong>
              <p className="muted">{reflection?.reflectionText ?? 'No reflection submitted yet.'}</p>
            </div>
            {reflection?.aiSummary && (
              <div className="signal-box">
                <strong>AI summary</strong>
                <p>{reflection.aiSummary}</p>
              </div>
            )}
          </div>
        </PageCard>
        <PageCard eyebrow="Assessment" title="Score dimensions" description="Enter scores for each TAI dimension (0–25 each).">
          <form action={submitAssessment} className="stack">
            <div className="form-grid-2">
              <label className="field">
                <span>Problem Complexity</span>
                <input name="problemComplexityScore" type="number" min={0} max={25} defaultValue={taiScore?.problemComplexityScore ?? 0} />
              </label>
              <label className="field">
                <span>Decision Quality</span>
                <input name="decisionQualityScore" type="number" min={0} max={25} defaultValue={taiScore?.decisionQualityScore ?? 0} />
              </label>
              <label className="field">
                <span>Impact</span>
                <input name="impactScore" type="number" min={0} max={25} defaultValue={taiScore?.impactScore ?? 0} />
              </label>
              <label className="field">
                <span>Reflective Maturity</span>
                <input name="reflectiveMaturityScore" type="number" min={0} max={25} defaultValue={taiScore?.reflectiveMaturityScore ?? 0} />
              </label>
            </div>
            <label className="field">
              <span>Assessor comment</span>
              <textarea name="assessorComment" rows={3} placeholder="Overall assessment and recommendation…" />
            </label>
            <div className="actions">
              <button className="button" type="submit">Save assessment</button>
            </div>
          </form>
        </PageCard>
      </div>
      {taiScore && (
        <PageCard eyebrow="Publish" title="TAI publication" description="Finalize the score and make it visible to the participant and program admin.">
          <div className="metric-stack">
            <div className="metric-strip">
              <div className="metric-card"><div className="metric-label">Problem Complexity</div><div className="metric-value">{taiScore.problemComplexityScore ?? 0}</div></div>
              <div className="metric-card"><div className="metric-label">Decision Quality</div><div className="metric-value">{taiScore.decisionQualityScore ?? 0}</div></div>
              <div className="metric-card"><div className="metric-label">Impact</div><div className="metric-value">{taiScore.impactScore ?? 0}</div></div>
              <div className="metric-card"><div className="metric-label">Reflective Maturity</div><div className="metric-value">{taiScore.reflectiveMaturityScore ?? 0}</div></div>
            </div>
            <div className="signal-box center-signal">
              <strong style={{ fontSize: '1.5rem' }}>Total TAI: {taiScore.totalTaiScore ?? 0}</strong>
              {taiScore.publishedFlag && <p className="muted">✓ Already published</p>}
            </div>
            {!taiScore.publishedFlag && (
              <form action={publishTai}>
                <div className="actions" style={{ justifyContent: 'center' }}>
                  <button className="button" type="submit">Publish TAI Score</button>
                </div>
              </form>
            )}
          </div>
        </PageCard>
      )}
    </AppShell>
  );
}
