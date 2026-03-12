import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ProblemStatement = {
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
  currentPhase: string;
  workflowState: string;
  participantUserId?: string;
  problemStatement?: ProblemStatement;
};

export default async function AnalysisReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const problem = project.problemStatement ?? {};

  async function reviewAction(formData: FormData) {
    'use server';

    const decision = String(formData.get('decision') ?? '');
    const reviewerComment = String(formData.get('reviewerComment') ?? '').trim();

    await postSessionJson(`/projects/${projectId}/problem-statement/review`, {
      decision,
      reviewerComment: reviewerComment || undefined,
    });
    revalidatePath(`/app/mentor/projects/${projectId}/analysis-review`);
    revalidatePath('/app/mentor/reviews');
    redirect('/app/mentor/reviews');
  }

  return (
    <AppShell title="Analysis Review" subtitle={`Review problem diagnostic for ${project.projectTitle}.`} roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Checkpoint review</div>
          <h2 className="hero-title">Pastikan framing masalah sudah cukup tajam untuk lanjut ke design.</h2>
          <p className="muted">Fokus pada kejelasan problem, kualitas root cause, dan kecukupan stakeholder mapping.</p>
        </div>
        <div className="metric-strip">
          <StatCard label="Phase" value="Analysis" />
          <StatCard label="State" value={problem.workflowState ?? project.workflowState} />
          {problem.confidenceScore != null && <StatCard label="AI Confidence" value={`${(problem.confidenceScore * 100).toFixed(0)}%`} />}
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Submission" title="Diagnostic report" description="Participant problem statement and AI analysis output.">
          <div className="stack">
            <div>
              <strong>Problem statement</strong>
              <p className="muted">{problem.rawProblemText ?? 'No problem statement submitted yet.'}</p>
            </div>
            {problem.reframedProblemText && (
              <div>
                <strong>AI-reframed problem</strong>
                <p className="muted">{problem.reframedProblemText}</p>
              </div>
            )}
            <div>
              <strong>Root causes</strong>
              <ul className="quick-list">
                {(problem.rootCauses ?? []).map((item) => <li key={item}>{item}</li>)}
                {(problem.rootCauses ?? []).length === 0 && <li className="muted">No root causes generated yet.</li>}
              </ul>
            </div>
            <div>
              <strong>Stakeholders</strong>
              <ul className="quick-list">
                {(problem.stakeholders ?? []).map((item) => <li key={item}>{item}</li>)}
                {(problem.stakeholders ?? []).length === 0 && <li className="muted">No stakeholders identified yet.</li>}
              </ul>
            </div>
          </div>
        </PageCard>
        <PageCard eyebrow="Decision" title="Review controls" description="Approve or request revision with mentor feedback.">
          <form action={reviewAction} className="stack">
            <label className="field">
              <span>Comment (optional)</span>
              <textarea name="reviewerComment" rows={4} placeholder="Provide specific feedback on what needs improvement…" />
            </label>
            <div className="actions">
              <button className="button" type="submit" name="decision" value="approved">✓ Approve</button>
              <button className="button secondary" type="submit" name="decision" value="revision_required">↩ Request revision</button>
            </div>
          </form>
          {problem.reviewerComment && (
            <div className="signal-box" style={{ marginTop: '1rem' }}>
              <strong>Previous feedback</strong>
              <p>{problem.reviewerComment}</p>
            </div>
          )}
        </PageCard>
      </div>
    </AppShell>
  );
}
