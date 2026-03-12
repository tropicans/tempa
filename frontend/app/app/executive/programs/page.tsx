import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function ExecutiveProgramsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Program Summaries" subtitle="Program-level reporting and approved outcome views." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Leadership lens</div>
          <h2 className="hero-title">Baca performa program dengan cepat tanpa turun ke detail operasional.</h2>
          <p className="muted">Executive summaries harus menonjolkan trend, risk, dan impact signals yang paling relevan untuk keputusan pimpinan.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Programs tracked</div><div className="metric-value">1</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Implementation rate</div><div className="metric-value">67%</div></div>
            <div className="metric-card"><div className="metric-label">Avg TAI</div><div className="metric-value">71.5</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Programs" description="List program summaries with score and implementation indicators." />
        <PageCard title="Executive focus" description="Use clear comparisons and concise narratives so leadership can detect which program needs attention first." />
      </div>
    </AppShell>
  );
}
