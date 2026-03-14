import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { DataTableCard } from '@/components/data-table-card';
import { FilterToolbar } from '@/components/filter-toolbar';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
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
          <AccentCard label="Platform status" value="Healthy" />
          <div className="metric-strip">
            <StatCard label="API" value="OK" />
            <StatCard label="Jobs" value="OK" />
            <StatCard label="AI latency" value="Nominal" />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Health" title="System monitoring" description="Show service health, queue health, and AI latency metrics here.">
          <FilterToolbar
            filters={[
              { label: 'All services', active: true },
              { label: 'API' },
              { label: 'Workers' },
              { label: 'AI' },
            ]}
            aside={<div className="filter-chip">Last 15 min</div>}
          />
          <DataTableCard
            columns={[
              { label: 'Service' },
              { label: 'Status' },
              { label: 'Latency' },
              { label: 'Signal' },
            ]}
            rows={[
              {
                key: 'backend-api',
                primary: <><strong>Backend API</strong><span className="table-secondary">Core session and project endpoints</span></>,
                cells: [
                  <span className="inline-status"><span className="status-dot" />Healthy</span>,
                  '132 ms',
                  'Nominal',
                ],
              },
              {
                key: 'ai-worker',
                primary: <><strong>AI worker</strong><span className="table-secondary">Analysis and reflection assistance jobs</span></>,
                cells: [
                  <span className="inline-status"><span className="status-dot" />Healthy</span>,
                  '420 ms',
                  'Watch',
                ],
              },
            ]}
          />
        </PageCard>
        <PageCard eyebrow="Operations" title="Operator checklist" description="Surface active incidents, recent config changes, and audit-ready status summaries.">
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
