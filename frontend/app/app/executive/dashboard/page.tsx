import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function ExecutiveDashboardPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Executive Dashboard" subtitle="Aggregate view of approved project outcomes and talent indicators." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Leadership view</div>
          <h2 className="hero-title">Lihat dampak program dan sinyal talenta tanpa tenggelam di detail operasional.</h2>
          <p className="muted">Executive mode menekankan portfolio health, implementation rate, dan distribusi TAI sebagai sinyal strategis.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-card"><div className="metric-label">Programs</div><div className="metric-value">1</div></div>
          <div className="metric-card"><div className="metric-label">Projects</div><div className="metric-value">12</div></div>
          <div className="metric-card"><div className="metric-label">Avg TAI</div><div className="metric-value">71.5</div></div>
        </div>
      </section>
      <div className="grid grid-3">
        <PageCard eyebrow="Impact" title="Program impact" description="High-level project and implementation metrics." />
        <PageCard eyebrow="Talent" title="TAI distribution" description="Aggregate score trends and cohort comparisons." />
        <PageCard eyebrow="Portfolio" title="Portfolio" description="Approved project summaries for leadership review." />
      </div>
    </AppShell>
  );
}
