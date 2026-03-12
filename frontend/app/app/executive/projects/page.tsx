import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function ExecutiveProjectsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Approved Projects" subtitle="Portfolio view for leadership and strategic stakeholders." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Portfolio lens</div>
          <h2 className="hero-title">Pantau proyek yang sudah matang tanpa terseret ke detail taktikal.</h2>
          <p className="muted">Portfolio page harus menampilkan outcomes, momentum, dan high-level risk in a very scannable form.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Approved projects</div><div className="metric-value">12</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">On track</div><div className="metric-value">9</div></div>
            <div className="metric-card"><div className="metric-label">Needs attention</div><div className="metric-value">3</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Project portfolio" description="Show approved projects only, with restricted detail.">
          <div className="toolbar-row">
            <div className="chip-row">
              <div className="filter-chip is-active">Approved only</div>
              <div className="filter-chip">High impact</div>
              <div className="filter-chip">At risk</div>
            </div>
            <div className="filter-chip">Portfolio snapshot</div>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Project</span>
              <span>Impact</span>
              <span>Momentum</span>
              <span>Owner</span>
            </div>
            <div className="table-list">
              <div className="table-grid">
                <div className="table-primary"><strong>Digital Permit Service Improvement</strong><span className="table-secondary">Reduced processing time and increased citizen satisfaction</span></div>
                <div className="table-cell">High</div>
                <div className="table-cell">On track</div>
                <div className="table-cell">Rina H.</div>
              </div>
              <div className="table-grid">
                <div className="table-primary"><strong>Procurement Workflow Simplification</strong><span className="table-secondary">Policy-ready outcome with moderate implementation dependency</span></div>
                <div className="table-cell">Medium</div>
                <div className="table-cell">Needs support</div>
                <div className="table-cell">Dimas A.</div>
              </div>
            </div>
          </div>
        </PageCard>
        <PageCard title="Reading pattern" description="Executives should be able to spot priority projects in seconds using strong status summaries and concise outcome language.">
          <div className="summary-panel">
            <strong>What leaders need first</strong>
            <div className="journey-list">
              <div className="journey-step"><strong>1</strong><div><h3>Outcome headline</h3><p className="muted">Show what changed, not just the project title.</p></div></div>
              <div className="journey-step"><strong>2</strong><div><h3>Risk and momentum</h3><p className="muted">One glance should reveal whether support is needed.</p></div></div>
              <div className="journey-step"><strong>3</strong><div><h3>Owner visibility</h3><p className="muted">Tie high-impact projects to clear accountability.</p></div></div>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
