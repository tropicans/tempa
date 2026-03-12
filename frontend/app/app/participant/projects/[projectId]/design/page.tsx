import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';
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

export default async function DesignPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const options = project.decisionOptions ?? [];
  const selectedOption = options.find((o) => o.selectedFlag);

  async function generateOptions() {
    'use server';

    await postSessionJson(`/projects/${projectId}/decision-options:ai`);
    revalidatePath(`/app/participant/projects/${projectId}/design`);
  }

  async function selectOption(formData: FormData) {
    'use server';

    const decisionOptionId = String(formData.get('decisionOptionId') ?? '');
    if (!decisionOptionId) return;
    await postSessionJson(`/projects/${projectId}/decision-options/${decisionOptionId}/select`);
    revalidatePath(`/app/participant/projects/${projectId}/design`);
  }

  return (
    <AppShell title="Design" subtitle={`Generate and compare solution options for ${project.projectTitle}.`} roleLabel={role}>
      <PhaseWorkspace phase="Design" projectTitle={project.projectTitle} projectState={project.workflowState}>
        <PageCard eyebrow="Generate" title="Decision options" description="Use AI to generate 3–5 solution options with benefit, risk, and feasibility scores.">
          <div className="stack">
            <form action={generateOptions}>
              <div className="actions">
                <button className="button" type="submit">Generate options with AI</button>
              </div>
            </form>
            {options.length === 0 ? (
              <p className="muted">No options generated yet. Click the button above to start.</p>
            ) : (
              <div className="project-list">
                {options.map((option) => (
                  <div key={option.decisionOptionId} className={`project-row ${option.selectedFlag ? 'selected' : ''}`}>
                    <div>
                      <strong>{option.optionRank}. {option.optionTitle}</strong>
                      {option.selectedFlag && <span className="pill" style={{ marginLeft: '0.5rem' }}>Selected</span>}
                      <p className="muted">{option.optionDescription}</p>
                      <div className="project-meta">
                        <span className="meta-chip">benefit: {option.benefitScore ?? '–'}</span>
                        <span className="meta-chip">risk: {option.riskScore ?? '–'}</span>
                        <span className="meta-chip">feasibility: {option.feasibilityScore ?? '–'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageCard>
        <PageCard eyebrow="Select" title="Preferred option" description="Choose the option you want to implement.">
          {options.length === 0 ? (
            <p className="muted">Generate options first.</p>
          ) : (
            <form action={selectOption} className="stack">
              <label className="field">
                <span>Select an option</span>
                <select name="decisionOptionId" defaultValue={selectedOption?.decisionOptionId ?? ''}>
                  <option value="" disabled>Choose an option…</option>
                  {options.map((option) => (
                    <option key={option.decisionOptionId} value={option.decisionOptionId}>
                      {option.optionRank}. {option.optionTitle}
                    </option>
                  ))}
                </select>
              </label>
              <div className="actions">
                <button className="button" type="submit">Confirm selection</button>
              </div>
            </form>
          )}
          {selectedOption && (
            <div className="signal-box" style={{ marginTop: '1rem' }}>
              <strong>Current selection</strong>
              <p>{selectedOption.optionTitle} — {selectedOption.optionDescription}</p>
            </div>
          )}
        </PageCard>
      </PhaseWorkspace>
    </AppShell>
  );
}
