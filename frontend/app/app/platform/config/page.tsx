import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { DataTableCard } from '@/components/data-table-card';
import { FilterToolbar } from '@/components/filter-toolbar';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
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
          <AccentCard label="Config posture" value="Controlled" />
          <div className="metric-strip">
            <StatCard label="Feature flags" value={8} />
            <StatCard label="Policies" value="Tracked" />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Configuration" description="Resolve prompt policies, feature flags, and system settings here.">
          <FilterToolbar
            filters={[
              { label: 'Feature flags', active: true },
              { label: 'Policies' },
              { label: 'Integrations' },
            ]}
            aside={<button className="button secondary" type="button">Review changes</button>}
          />
          <DataTableCard
            columns={[
              { label: 'Setting' },
              { label: 'Scope' },
              { label: 'Status' },
              { label: 'Last change' },
            ]}
            rows={[
              {
                key: 'ai-assistance-analysis',
                primary: <><strong>AI assistance for analysis</strong><span className="table-secondary">Participant workspace prompt flow</span></>,
                cells: [
                  'Global',
                  <span className="inline-status"><span className="status-dot" />Enabled</span>,
                  'Today 07:55',
                ],
              },
              {
                key: 'executive-portfolio-export',
                primary: <><strong>Executive portfolio export</strong><span className="table-secondary">Leadership reporting feature flag</span></>,
                cells: ['Executive', 'Staged', 'Yesterday'],
              },
            ]}
          />
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
