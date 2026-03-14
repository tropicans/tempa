import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
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
          <AccentCard label="Cohort status" value="Active" />
          <div className="metric-strip">
            <StatCard label="Participants" value={24} />
            <StatCard label="Mentors" value={6} />
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
