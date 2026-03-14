import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { DataTableCard } from '@/components/data-table-card';
import { FilterToolbar } from '@/components/filter-toolbar';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function PlatformAuditPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Audit Explorer" subtitle="Operational audit trail viewer for controlled support access." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Audit visibility</div>
          <h2 className="hero-title">Buat jejak perubahan terasa jelas, bukan menakutkan atau berantakan.</h2>
          <p className="muted">Operator perlu cepat memahami who changed what, when, and why without parsing overly dense raw logs.</p>
        </div>
        <div className="hero-panel-surface stack">
          <AccentCard label="Critical events" value={4} />
          <div className="metric-strip">
            <StatCard label="Approvals" value={12} />
            <StatCard label="Overrides" value={1} />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Audit log" description="Show critical transitions, approvals, and override records here.">
          <FilterToolbar
            filters={[
              { label: 'All events', active: true },
              { label: 'Critical' },
              { label: 'Approval' },
              { label: 'Override' },
            ]}
            aside={<div className="filter-chip">Today</div>}
          />
          <DataTableCard
            columns={[
              { label: 'Event' },
              { label: 'Actor' },
              { label: 'Severity' },
              { label: 'Time' },
            ]}
            rows={[
              {
                key: 'tai-publication-override',
                primary: <><strong>TAI publication override</strong><span className="table-secondary">Manual override recorded for participant visibility</span></>,
                cells: ['platform.operator', 'Critical', '08:14'],
              },
              {
                key: 'implementation-approved',
                primary: <><strong>Implementation plan approved</strong><span className="table-secondary">Mentor approval for cohort 2026 pilot</span></>,
                cells: ['mentor.budi', 'Normal', '07:42'],
              },
            ]}
          />
        </PageCard>
        <PageCard title="Audit UX principle" description="Highlight severity, actor, and timestamp first so operators can triage quickly before opening the full record.">
          <div className="summary-panel">
            <strong>Reading order</strong>
            <div className="journey-list">
              <div className="journey-step"><strong>1</strong><div><h3>Severity first</h3><p className="muted">Operators should notice exceptions before routine activity.</p></div></div>
              <div className="journey-step"><strong>2</strong><div><h3>Actor next</h3><p className="muted">Identity is essential for support and governance follow-up.</p></div></div>
              <div className="journey-step"><strong>3</strong><div><h3>Time and reason</h3><p className="muted">Fast chronology helps connect changes to incidents.</p></div></div>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
