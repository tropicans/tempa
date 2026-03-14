import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { DataTableCard } from '@/components/data-table-card';
import { FilterToolbar } from '@/components/filter-toolbar';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
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
          <AccentCard label="Approved projects" value={12} />
          <div className="metric-strip">
            <StatCard label="On track" value={9} />
            <StatCard label="Needs attention" value={3} />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Project portfolio" description="Show approved projects only, with restricted detail.">
          <FilterToolbar
            filters={[
              { label: 'Approved only', active: true },
              { label: 'High impact' },
              { label: 'At risk' },
            ]}
            aside={<div className="filter-chip">Portfolio snapshot</div>}
          />
          <DataTableCard
            columns={[
              { label: 'Project' },
              { label: 'Impact' },
              { label: 'Momentum' },
              { label: 'Owner' },
            ]}
            rows={[
              {
                key: 'permit-improvement',
                primary: <><strong>Digital Permit Service Improvement</strong><span className="table-secondary">Reduced processing time and increased citizen satisfaction</span></>,
                cells: ['High', 'On track', 'Rina H.'],
              },
              {
                key: 'procurement-simplification',
                primary: <><strong>Procurement Workflow Simplification</strong><span className="table-secondary">Policy-ready outcome with moderate implementation dependency</span></>,
                cells: ['Medium', 'Needs support', 'Dimas A.'],
              },
            ]}
          />
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
