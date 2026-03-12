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
        <PageCard title="Audit log" description="Show critical transitions, approvals, and override records here." />
        <PageCard title="Audit UX principle" description="Highlight severity, actor, and timestamp first so operators can triage quickly before opening the full record." />
      </div>
    </AppShell>
  );
}
