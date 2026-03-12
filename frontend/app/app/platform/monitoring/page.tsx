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
        <PageCard title="System monitoring" description="Show service health, queue health, and AI latency metrics here." />
        <PageCard title="Operator checklist" description="Surface active incidents, recent config changes, and audit-ready status summaries." />
      </div>
    </AppShell>
  );
}
