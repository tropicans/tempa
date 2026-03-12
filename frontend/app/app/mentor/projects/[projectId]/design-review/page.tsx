import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type DecisionOption = {
  decisionOptionId: string;
  optionRank: number;
  optionTitle: string;
  optionDescription: string;
  benefitScore?: number;
  riskScore?: number;
  feasibilityScore?: number;
  selectedFlag: boolean;
};

type ProjectDetail = {
  projectId: string;
  projectTitle: string;
  currentPhase: string;
  workflowState: string;
  decisionOptions: DecisionOption[];
};

export default async function DesignReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const options = project.decisionOptions ?? [];
  const selectedOption = options.find((o) => o.selectedFlag);

  async function reviewAction(formData: FormData) {
    'use server';

    const decision = String(formData.get('decision') ?? '');
    const reviewerComment = String(formData.get('reviewerComment') ?? '').trim();

    await postSessionJson(`/projects/${projectId}/decision-options/review`, {
      decision,
      reviewerComment: reviewerComment || undefined,
    });
    revalidatePath(`/app/mentor/projects/${projectId}/design-review`);
    revalidatePath('/app/mentor/reviews');
    redirect('/app/mentor/reviews');
  }

  return (
    <AppShell title="Design Review" subtitle={`Review decision options for ${project.projectTitle}.`} roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Decision review</div>
          <h2 className="hero-title">Validasi apakah opsi yang dipilih benar-benar paling layak.</h2>
          <p className="muted">Bandingkan manfaat, risiko, dan feasibility sebelum peserta masuk ke implementation plan.</p>
        </div>
        <div className="metric-strip">
          <StatCard label="Phase" value="Design" />
          <StatCard label="Options" value={options.length} />
          <StatCard label="Selected" value={selectedOption?.optionTitle ?? 'None'} />
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Options" title="Decision options" description="All generated options with scores.">
          <div className="stack">
            {options.map((option) => (
              <div key={option.decisionOptionId} className={`decision-box ${option.selectedFlag ? 'selected' : ''}`}>
                <strong>{option.optionRank}. {option.optionTitle}</strong>
                {option.selectedFlag && <span className="pill" style={{ marginLeft: '0.5rem' }}>Selected</span>}
                <p className="muted">{option.optionDescription}</p>
                <div className="project-meta">
                  <span className="meta-chip">benefit: {option.benefitScore ?? '–'}</span>
                  <span className="meta-chip">risk: {option.riskScore ?? '–'}</span>
                  <span className="meta-chip">feasibility: {option.feasibilityScore ?? '–'}</span>
                </div>
              </div>
            ))}
            {options.length === 0 && <p className="muted">No decision options generated yet.</p>}
          </div>
        </PageCard>
        <PageCard eyebrow="Decision" title="Review controls" description="Approve the selected option or request revision.">
          <form action={reviewAction} className="stack">
            <label className="field">
              <span>Comment (optional)</span>
              <textarea name="reviewerComment" rows={4} placeholder="Is the selected option well-justified? Any concerns?" />
            </label>
            <div className="actions">
              <button className="button" type="submit" name="decision" value="approved">✓ Approve selection</button>
              <button className="button secondary" type="submit" name="decision" value="revision_required">↩ Request revision</button>
            </div>
          </form>
        </PageCard>
      </div>
    </AppShell>
  );
}
