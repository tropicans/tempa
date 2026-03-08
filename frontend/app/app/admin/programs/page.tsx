import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function AdminProgramsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Programs" subtitle="Create and manage TEMPA learning programs." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Program operations</div>
          <h2 className="hero-title">Atur program, cohort, dan mentor assignment dari satu tempat.</h2>
          <p className="muted">Admin panel harus terasa ringan untuk setup, tapi tetap kuat untuk governance dan monitoring.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-card"><div className="metric-label">Programs</div><div className="metric-value">1</div></div>
          <div className="metric-card"><div className="metric-label">Active cohorts</div><div className="metric-value">1</div></div>
        </div>
      </section>
      <PageCard eyebrow="Admin" title="Program management" description="Program list, filters, and create-program entry point." />
    </AppShell>
  );
}
