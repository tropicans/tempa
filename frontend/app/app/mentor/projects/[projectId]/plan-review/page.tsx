import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function PlanReviewPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Implementation Plan Review" subtitle="Review roadmap, milestones, KPIs, and risk controls." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Development gate</div>
          <h2 className="hero-title">Pastikan rencana implementasi cukup konkret untuk dieksekusi.</h2>
          <p className="muted">Periksa milestone, KPI, dan risk handling sebelum proyek masuk implementation mode.</p>
        </div>
        <div className="metric-strip">
          <StatCard label="Milestones" value="4" />
          <StatCard label="KPIs" value="3" />
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard eyebrow="Blueprint" title="Plan review" description="Support approve and revision-required decisions here.">
          <div className="decision-grid">
            <div className="decision-box"><strong>Milestones</strong><p className="muted">Setup, pilot rollout, adoption review, and final evaluation.</p></div>
            <div className="decision-box"><strong>KPIs</strong><p className="muted">Response time, backlog visibility, and citizen follow-up rate.</p></div>
            <div className="decision-box"><strong>Risks</strong><p className="muted">Operational resistance, incomplete adoption, and reporting inconsistency.</p></div>
          </div>
        </PageCard>
        <PageCard eyebrow="Mentor lens" title="Approval prompts" description="Check whether the participant has a plan that can be tested, measured, and defended.">
          <div className="journey-list">
            <div className="journey-step"><strong>1</strong><div><b>Are milestones realistic?</b></div></div>
            <div className="journey-step"><strong>2</strong><div><b>Do KPIs map to the core problem?</b></div></div>
            <div className="journey-step"><strong>3</strong><div><b>Is there a clear fallback for implementation risk?</b></div></div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
