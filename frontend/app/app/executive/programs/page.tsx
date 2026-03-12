import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
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
          <div className="metric-card accent-card"><div className="metric-label">Programs tracked</div><div className="metric-value">1</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Implementation rate</div><div className="metric-value">67%</div></div>
            <div className="metric-card"><div className="metric-label">Avg TAI</div><div className="metric-value">71.5</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Programs" description="List program summaries with score and implementation indicators.">
          <div className="toolbar-row">
            <div className="chip-row">
              <div className="filter-chip is-active">All programs</div>
              <div className="filter-chip">High momentum</div>
              <div className="filter-chip">Needs attention</div>
            </div>
            <div className="filter-chip">Quarterly view</div>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Program</span>
              <span>Implementation</span>
              <span>Avg TAI</span>
              <span>Risk</span>
            </div>
            <div className="table-list">
              <div className="table-grid">
                <div className="table-primary"><strong>Leadership Essentials 2026</strong><span className="table-secondary">24 participants across one active cohort</span></div>
                <div className="table-cell">67%</div>
                <div className="table-cell">71.5</div>
                <div className="table-cell">Low</div>
              </div>
              <div className="table-grid">
                <div className="table-primary"><strong>Digital Ops Accelerator</strong><span className="table-secondary">New intake preparing for launch</span></div>
                <div className="table-cell">12%</div>
                <div className="table-cell">Pending</div>
                <div className="table-cell">Medium</div>
              </div>
            </div>
          </div>
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
