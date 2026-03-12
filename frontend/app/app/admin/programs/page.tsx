import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function AdminProgramsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Programs" subtitle="Create and manage TEMPA learning programs." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Program operations</div>
          <h2 className="hero-title">Atur program, cohort, dan mentor assignment dari satu tempat.</h2>
          <p className="muted">Admin panel harus terasa ringan untuk setup, tapi tetap kuat untuk governance dan monitoring.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Programs</div><div className="metric-value">1</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Active cohorts</div><div className="metric-value">1</div></div>
            <div className="metric-card"><div className="metric-label">Mentor assignments</div><div className="metric-value">Live</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Admin" title="Program management" description="Program list, filters, and create-program entry point.">
          <div className="toolbar-row">
            <div className="chip-row">
              <div className="filter-chip is-active">All programs</div>
              <div className="filter-chip">Active</div>
              <div className="filter-chip">Needs setup</div>
            </div>
            <button className="button" type="button">New program</button>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Program</span>
              <span>Cohorts</span>
              <span>Status</span>
              <span>Owner</span>
            </div>
            <div className="table-list">
              <div className="table-grid">
                <div className="table-primary"><strong>Leadership Essentials 2026</strong><span className="table-secondary">Primary public-sector learning track</span></div>
                <div className="table-cell">1 live</div>
                <div className="table-cell"><span className="inline-status"><span className="status-dot" />Active</span></div>
                <div className="table-cell">Program office</div>
              </div>
              <div className="table-grid">
                <div className="table-primary"><strong>Digital Ops Accelerator</strong><span className="table-secondary">Pending launch and rubric sign-off</span></div>
                <div className="table-cell">0 draft</div>
                <div className="table-cell">Needs setup</div>
                <div className="table-cell">Transformation team</div>
              </div>
            </div>
          </div>
        </PageCard>
        <PageCard eyebrow="Design principle" title="Simple operations" description="Keep setup tasks grouped by object so admins can move from program to cohort to assignment without hunting for controls.">
          <div className="summary-panel">
            <strong>Recommended structure</strong>
            <div className="kv-list">
              <div className="kv-row"><span className="kv-key">Primary action</span><strong>Create program</strong></div>
              <div className="kv-row"><span className="kv-key">Secondary action</span><strong>Open cohort setup</strong></div>
              <div className="kv-row"><span className="kv-key">Status read</span><strong>Setup, live, archived</strong></div>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
