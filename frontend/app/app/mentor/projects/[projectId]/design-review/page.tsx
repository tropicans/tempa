import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function DesignReviewPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Design Review" subtitle="Review selected decision option and trade-offs." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Decision review</div>
          <h2 className="hero-title">Validasi apakah opsi yang dipilih benar-benar paling layak.</h2>
          <p className="muted">Bandingkan manfaat, risiko, dan feasibility sebelum peserta masuk ke implementation plan.</p>
        </div>
        <div className="metric-strip">
          <StatCard label="Phase" value="Design" />
          <StatCard label="Selected option" value="1" />
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Selected path" title="Decision validation" description="Render selected option, comparison summary, and mentor actions.">
          <div className="decision-grid">
            <div className="decision-box"><strong>Option A</strong><p className="muted">Centralized triage dashboard with simple routing automation.</p></div>
            <div className="decision-box"><strong>Benefit</strong><p className="muted">Improves speed, transparency, and supervisor visibility.</p></div>
            <div className="decision-box"><strong>Risk</strong><p className="muted">Requires change management and cross-unit adoption.</p></div>
          </div>
        </PageCard>
        <PageCard eyebrow="Mentor prompt" title="Trade-off checklist" description="Use these prompts to challenge the participant decision quality.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><b>Does the option solve the root cause?</b></div></div>
            <div className="journey-step"><strong>2</strong><div><b>Is the risk manageable in the pilot environment?</b></div></div>
            <div className="journey-step"><strong>3</strong><div><b>Can the result be measured during implementation?</b></div></div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
