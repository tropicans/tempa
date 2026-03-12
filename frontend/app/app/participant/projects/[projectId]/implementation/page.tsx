import { revalidatePath } from 'next/cache';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { PhaseWorkspace } from '@/components/phase-workspace';
import { fetchSessionJson, postSessionJson } from '@/lib/api';
import { getSessionRole } from '@/lib/session';

type ProgressLogEntry = {
  progressLogId: string;
  phaseName: string;
  progressPercent: number;
  statusNote?: string;
  riskNote?: string;
  loggedAt: string;
};

type ImpactMetricEntry = {
  impactMetricId: string;
  metricCode: string;
  metricName: string;
  baselineValue?: number;
  targetValue?: number;
  actualValue: number;
  unitOfMeasure?: string;
  measurementDate: string;
};

type ProjectDetail = {
  projectId: string;
  projectTitle: string;
  currentPhase: string;
  workflowState: string;
  progressLogs: ProgressLogEntry[];
  impactMetrics: ImpactMetricEntry[];
};

export default async function ImplementationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const role = await getSessionRole();
  const project = await fetchSessionJson<ProjectDetail>(`/projects/${projectId}`);
  const logs = project.progressLogs ?? [];
  const metrics = project.impactMetrics ?? [];

  async function addProgressLog(formData: FormData) {
    'use server';

    const phaseName = String(formData.get('phaseName') ?? 'implementation');
    const progressPercent = Number(formData.get('progressPercent') ?? 0);
    const statusNote = String(formData.get('statusNote') ?? '').trim() || undefined;
    const riskNote = String(formData.get('riskNote') ?? '').trim() || undefined;

    await postSessionJson(`/projects/${projectId}/progress-logs`, {
      phaseName,
      progressPercent,
      statusNote,
      riskNote,
    });
    revalidatePath(`/app/participant/projects/${projectId}/implementation`);
  }

  async function addImpactMetric(formData: FormData) {
    'use server';

    const metricName = String(formData.get('metricName') ?? '').trim();
    if (!metricName) return;

    const metricCode = String(formData.get('metricCode') ?? metricName.toLowerCase().replace(/\s+/g, '-')).trim();
    const baselineValue = formData.get('baselineValue') ? Number(formData.get('baselineValue')) : undefined;
    const targetValue = formData.get('targetValue') ? Number(formData.get('targetValue')) : undefined;
    const actualValue = Number(formData.get('actualValue') ?? 0);
    const unitOfMeasure = String(formData.get('unitOfMeasure') ?? '').trim() || undefined;

    await postSessionJson(`/projects/${projectId}/impact-metrics`, {
      metricCode,
      metricName,
      baselineValue,
      targetValue,
      actualValue,
      unitOfMeasure,
    });
    revalidatePath(`/app/participant/projects/${projectId}/implementation`);
  }

  return (
    <AppShell title="Implementation" subtitle={`Track progress, evidence, and impact for ${project.projectTitle}.`} roleLabel={role}>
      <PhaseWorkspace phase="Implementation" projectTitle={project.projectTitle} projectState={project.workflowState}>
        <PageCard eyebrow="Track" title="Progress log" description="Record implementation progress, status notes, and risks.">
          <form action={addProgressLog} className="stack">
            <div className="form-grid-2">
              <label className="field">
                <span>Phase</span>
                <select name="phaseName" defaultValue="implementation">
                  <option value="analysis">Analysis</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="implementation">Implementation</option>
                  <option value="evaluation">Evaluation</option>
                </select>
              </label>
              <label className="field">
                <span>Progress %</span>
                <input name="progressPercent" type="number" min={0} max={100} defaultValue={0} />
              </label>
            </div>
            <label className="field">
              <span>Status note</span>
              <textarea name="statusNote" rows={2} placeholder="What was accomplished this period?" />
            </label>
            <label className="field">
              <span>Risk note</span>
              <textarea name="riskNote" rows={2} placeholder="Any emerging risks or blockers?" />
            </label>
            <div className="actions">
              <button className="button" type="submit">Add progress entry</button>
            </div>
          </form>
          {logs.length > 0 && (
            <div className="project-list" style={{ marginTop: '1rem' }}>
              {logs.map((log) => (
                <div key={log.progressLogId} className="project-row">
                  <div>
                    <strong>{log.phaseName} — {log.progressPercent}%</strong>
                    {log.statusNote && <p className="muted">{log.statusNote}</p>}
                    {log.riskNote && <p className="tiny-note" style={{ color: '#a16207' }}>Risk: {log.riskNote}</p>}
                    <div className="project-meta">
                      <span className="meta-chip">{new Date(log.loggedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {logs.length === 0 && <p className="muted" style={{ marginTop: '1rem' }}>No progress entries yet.</p>}
        </PageCard>

        <PageCard eyebrow="Measure" title="Impact metrics" description="Record baseline, target, and actual values for your key performance indicators.">
          <form action={addImpactMetric} className="stack">
            <div className="form-grid-2">
              <label className="field">
                <span>Metric name</span>
                <input name="metricName" placeholder="e.g. Service processing time" required />
              </label>
              <label className="field">
                <span>Unit</span>
                <input name="unitOfMeasure" placeholder="e.g. days, %, count" />
              </label>
            </div>
            <div className="form-grid-3">
              <label className="field">
                <span>Baseline</span>
                <input name="baselineValue" type="number" step="any" placeholder="Before" />
              </label>
              <label className="field">
                <span>Target</span>
                <input name="targetValue" type="number" step="any" placeholder="Goal" />
              </label>
              <label className="field">
                <span>Actual</span>
                <input name="actualValue" type="number" step="any" defaultValue={0} />
              </label>
            </div>
            <div className="actions">
              <button className="button" type="submit">Add metric</button>
            </div>
          </form>
          {metrics.length > 0 && (
            <div className="project-list" style={{ marginTop: '1rem' }}>
              {metrics.map((metric) => (
                <div key={metric.impactMetricId} className="project-row">
                  <div>
                    <strong>{metric.metricName}</strong>
                    <div className="project-meta">
                      <span className="meta-chip">baseline: {metric.baselineValue ?? '–'}</span>
                      <span className="meta-chip">target: {metric.targetValue ?? '–'}</span>
                      <span className="meta-chip">actual: {metric.actualValue}</span>
                      {metric.unitOfMeasure && <span className="meta-chip">{metric.unitOfMeasure}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {metrics.length === 0 && <p className="muted" style={{ marginTop: '1rem' }}>No impact metrics recorded yet.</p>}
        </PageCard>
        <PageCard eyebrow="Operating rhythm" title="Keep implementation readable" description="This view should surface progress and proof, not just raw entries.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><h3>Log short updates</h3><p className="muted">Use concise status notes so mentors and admins can scan momentum quickly.</p></div></div>
            <div className="journey-step"><strong>2</strong><div><h3>Track only meaningful metrics</h3><p className="muted">Prefer a few high-signal KPIs over a long list of weak ones.</p></div></div>
            <div className="journey-step"><strong>3</strong><div><h3>Show blockers early</h3><p className="muted">Risk notes help the program support the project before delay compounds.</p></div></div>
          </div>
        </PageCard>
      </PhaseWorkspace>
    </AppShell>
  );
}
