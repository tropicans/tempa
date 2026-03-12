import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function PlatformMonitoringPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Monitoring" subtitle="Runtime health, AI usage, and platform signals for operators." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Operator console</div>
          <h2 className="hero-title">Pastikan layanan stabil, terukur, dan mudah diaudit.</h2>
          <p className="muted">Operator view harus ringkas: health, incident signals, and configuration checkpoints first.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Platform status</div><div className="metric-value">Healthy</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">API</div><div className="metric-value">OK</div></div>
            <div className="metric-card"><div className="metric-label">Jobs</div><div className="metric-value">OK</div></div>
            <div className="metric-card"><div className="metric-label">AI latency</div><div className="metric-value">Nominal</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="System monitoring" description="Show service health, queue health, and AI latency metrics here.">
          <div className="toolbar-row">
            <div className="chip-row">
              <div className="filter-chip is-active">All services</div>
              <div className="filter-chip">API</div>
              <div className="filter-chip">Workers</div>
              <div className="filter-chip">AI</div>
            </div>
            <div className="filter-chip">Last 15 min</div>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Service</span>
              <span>Status</span>
              <span>Latency</span>
              <span>Signal</span>
            </div>
            <div className="table-list">
              <div className="table-grid">
                <div className="table-primary"><strong>Backend API</strong><span className="table-secondary">Core session and project endpoints</span></div>
                <div className="table-cell"><span className="inline-status"><span className="status-dot" />Healthy</span></div>
                <div className="table-cell">132 ms</div>
                <div className="table-cell">Nominal</div>
              </div>
              <div className="table-grid">
                <div className="table-primary"><strong>AI worker</strong><span className="table-secondary">Analysis and reflection assistance jobs</span></div>
                <div className="table-cell"><span className="inline-status"><span className="status-dot" />Healthy</span></div>
                <div className="table-cell">420 ms</div>
                <div className="table-cell">Watch</div>
              </div>
            </div>
          </div>
        </PageCard>
        <PageCard title="Operator checklist" description="Surface active incidents, recent config changes, and audit-ready status summaries.">
          <div className="summary-panel">
            <strong>Current watchlist</strong>
            <div className="kv-list">
              <div className="kv-row"><span className="kv-key">Open incidents</span><strong>0</strong></div>
              <div className="kv-row"><span className="kv-key">Recent config changes</span><strong>2 in 24h</strong></div>
              <div className="kv-row"><span className="kv-key">Queue backlog</span><strong>Low</strong></div>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
