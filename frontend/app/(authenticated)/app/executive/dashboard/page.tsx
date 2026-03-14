import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function ExecutiveDashboardPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Executive Dashboard" subtitle="Aggregate view of approved project outcomes and talent indicators." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Leadership view</div>
          <h2 className="hero-title">Lihat dampak program dan sinyal talenta tanpa tenggelam di detail operasional.</h2>
          <p className="muted">Executive mode menekankan portfolio health, implementation rate, dan distribusi TAI sebagai sinyal strategis.</p>
        </div>
        <div className="hero-panel-surface stack">
          <AccentCard label="Portfolio health" value="Stable" />
          <div className="metric-strip">
            <StatCard label="Programs" value={1} />
            <StatCard label="Projects" value={12} />
            <StatCard label="Avg TAI" value={71.5} />
          </div>
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
