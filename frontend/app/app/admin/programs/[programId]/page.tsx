import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function AdminProgramDetailPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Program Detail" subtitle="View program settings, cohorts, and reporting summary." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Program detail</div>
          <h2 className="hero-title">Rangkum pengaturan program dan status eksekusinya dalam satu view.</h2>
          <p className="muted">Program detail sebaiknya menjadi titik koordinasi antara setup, cohort progress, dan reporting.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Program state</div><div className="metric-value">Live</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Cohorts</div><div className="metric-value">1</div></div>
            <div className="metric-card"><div className="metric-label">Reporting</div><div className="metric-value">Ready</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Program detail" description="Render program metadata, date windows, and linked cohorts." />
        <PageCard title="Operator mindset" description="Use this space to make key program settings understandable at a glance before anyone edits them." />
      </div>
    </AppShell>
  );
}
