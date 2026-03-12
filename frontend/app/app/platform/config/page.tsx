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
        <PageCard title="Configuration" description="Resolve prompt policies, feature flags, and system settings here.">
          <div className="toolbar-row">
            <div className="chip-row">
              <div className="filter-chip is-active">Feature flags</div>
              <div className="filter-chip">Policies</div>
              <div className="filter-chip">Integrations</div>
            </div>
            <button className="button secondary" type="button">Review changes</button>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Setting</span>
              <span>Scope</span>
              <span>Status</span>
              <span>Last change</span>
            </div>
            <div className="table-list">
              <div className="table-grid">
                <div className="table-primary"><strong>AI assistance for analysis</strong><span className="table-secondary">Participant workspace prompt flow</span></div>
                <div className="table-cell">Global</div>
                <div className="table-cell"><span className="inline-status"><span className="status-dot" />Enabled</span></div>
                <div className="table-cell">Today 07:55</div>
              </div>
              <div className="table-grid">
                <div className="table-primary"><strong>Executive portfolio export</strong><span className="table-secondary">Leadership reporting feature flag</span></div>
                <div className="table-cell">Executive</div>
                <div className="table-cell">Staged</div>
                <div className="table-cell">Yesterday</div>
              </div>
            </div>
          </div>
        </PageCard>
        <PageCard title="Safety pattern" description="Group high-risk settings separately and add clear intent labels so operators understand impact before editing.">
          <div className="summary-panel">
            <strong>Control model</strong>
            <div className="kv-list">
              <div className="kv-row"><span className="kv-key">Low risk</span><strong>Display and reporting flags</strong></div>
              <div className="kv-row"><span className="kv-key">Medium risk</span><strong>Workflow automation rules</strong></div>
              <div className="kv-row"><span className="kv-key">High risk</span><strong>Prompt policies and score publication controls</strong></div>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
