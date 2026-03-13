import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function AdminCohortMentorsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Mentor Assignment" subtitle="Assign mentors to participants and review load distribution." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Assignment balancing</div>
          <h2 className="hero-title">Pastikan beban mentor merata dan hubungan assignment tetap jelas.</h2>
          <p className="muted">Admin harus bisa melihat distribusi mentoring dan memperbaiki overload tanpa berpindah banyak layar.</p>
        </div>
        <div className="hero-panel-surface stack">
          <AccentCard label="Assignments" value={24} />
          <div className="metric-strip">
            <StatCard label="Mentors active" value={6} />
            <StatCard label="Load balance" value="Stable" />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Mentor assignments" description="Render assignment matrix and balancing actions here." />
        <PageCard title="Design note" description="Lead with imbalance signals and quick reassignment actions so admins do not need to inspect every row manually." />
      </div>
    </AppShell>
  );
}
