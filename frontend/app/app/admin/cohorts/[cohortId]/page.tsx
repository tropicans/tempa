import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function AdminCohortPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Cohort Detail" subtitle="Manage cohort schedules, enrollments, and mentor assignments." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Cohort operations</div>
          <h2 className="hero-title">Kelola ritme cohort tanpa kehilangan konteks operasional.</h2>
          <p className="muted">Halaman ini sebaiknya menjadi ringkasan cohort health, phase windows, dan assignment readiness.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Cohort status</div><div className="metric-value">Active</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Participants</div><div className="metric-value">24</div></div>
            <div className="metric-card"><div className="metric-label">Mentors</div><div className="metric-value">6</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Cohort management" description="Show phase windows, participant counts, and assignment health." />
        <PageCard title="Admin focus" description="Keep schedule, enrollment, and mentor balancing visible in one place so the cohort can be adjusted quickly." />
      </div>
    </AppShell>
  );
}
