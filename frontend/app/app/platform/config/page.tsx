import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function PlatformConfigPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Platform Config" subtitle="Operational configuration view for platform operators." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">System configuration</div>
          <h2 className="hero-title">Sajikan pengaturan penting dalam struktur yang aman dan mudah dipahami.</h2>
          <p className="muted">Configuration pages should separate risky settings from routine controls so operators can move confidently.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Config posture</div><div className="metric-value">Controlled</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Feature flags</div><div className="metric-value">8</div></div>
            <div className="metric-card"><div className="metric-label">Policies</div><div className="metric-value">Tracked</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Configuration" description="Resolve prompt policies, feature flags, and system settings here." />
        <PageCard title="Safety pattern" description="Group high-risk settings separately and add clear intent labels so operators understand impact before editing." />
      </div>
    </AppShell>
  );
}
