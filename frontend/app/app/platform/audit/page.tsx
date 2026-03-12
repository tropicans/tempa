import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
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
          <div className="metric-card accent-card"><div className="metric-label">Critical events</div><div className="metric-value">4</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Approvals</div><div className="metric-value">12</div></div>
            <div className="metric-card"><div className="metric-label">Overrides</div><div className="metric-value">1</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Audit log" description="Show critical transitions, approvals, and override records here.">
          <div className="toolbar-row">
            <div className="chip-row">
              <div className="filter-chip is-active">All events</div>
              <div className="filter-chip">Critical</div>
              <div className="filter-chip">Approval</div>
              <div className="filter-chip">Override</div>
            </div>
            <div className="filter-chip">Today</div>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Event</span>
              <span>Actor</span>
              <span>Severity</span>
              <span>Time</span>
            </div>
            <div className="table-list">
              <div className="table-grid">
                <div className="table-primary"><strong>TAI publication override</strong><span className="table-secondary">Manual override recorded for participant visibility</span></div>
                <div className="table-cell">platform.operator</div>
                <div className="table-cell">Critical</div>
                <div className="table-cell">08:14</div>
              </div>
              <div className="table-grid">
                <div className="table-primary"><strong>Implementation plan approved</strong><span className="table-secondary">Mentor approval for cohort 2026 pilot</span></div>
                <div className="table-cell">mentor.budi</div>
                <div className="table-cell">Normal</div>
                <div className="table-cell">07:42</div>
              </div>
            </div>
          </div>
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
