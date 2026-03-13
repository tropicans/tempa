import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { DataTableCard } from '@/components/data-table-card';
import { FilterToolbar } from '@/components/filter-toolbar';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function ExecutiveProgramsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Program Summaries" subtitle="Program-level reporting and approved outcome views." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Leadership lens</div>
          <h2 className="hero-title">Baca performa program dengan cepat tanpa turun ke detail operasional.</h2>
          <p className="muted">Executive summaries harus menonjolkan trend, risk, dan impact signals yang paling relevan untuk keputusan pimpinan.</p>
        </div>
        <div className="hero-panel-surface stack">
          <AccentCard label="Programs tracked" value={1} />
          <div className="metric-strip">
            <StatCard label="Implementation rate" value="67%" />
            <StatCard label="Avg TAI" value={71.5} />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Programs" description="List program summaries with score and implementation indicators.">
          <FilterToolbar
            filters={[
              { label: 'All programs', active: true },
              { label: 'High momentum' },
              { label: 'Needs attention' },
            ]}
            aside={<div className="filter-chip">Quarterly view</div>}
          />
          <DataTableCard
            columns={[
              { label: 'Program' },
              { label: 'Implementation' },
              { label: 'Avg TAI' },
              { label: 'Risk' },
            ]}
            rows={[
              {
                key: 'leadership-essentials',
                primary: <><strong>Leadership Essentials 2026</strong><span className="table-secondary">24 participants across one active cohort</span></>,
                cells: ['67%', '71.5', 'Low'],
              },
              {
                key: 'digital-ops',
                primary: <><strong>Digital Ops Accelerator</strong><span className="table-secondary">New intake preparing for launch</span></>,
                cells: ['12%', 'Pending', 'Medium'],
              },
            ]}
          />
        </PageCard>
        <PageCard title="Executive focus" description="Use clear comparisons and concise narratives so leadership can detect which program needs attention first.">
          <div className="summary-panel">
            <strong>Decision pattern</strong>
            <div className="kv-list">
              <div className="kv-row"><span className="kv-key">Best signal</span><strong>Trend + risk in one row</strong></div>
              <div className="kv-row"><span className="kv-key">Avoid</span><strong>Dense operational detail</strong></div>
              <div className="kv-row"><span className="kv-key">Outcome</span><strong>Faster leadership scan</strong></div>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
