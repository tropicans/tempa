import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function MentorDashboardPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Mentor Dashboard" subtitle="Monitor assigned participants and pending reviews." roleLabel={role}>
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Mentor cockpit</div>
          <h2 className="hero-title">Jaga kualitas keputusan peserta di setiap checkpoint.</h2>
          <p className="muted">Mentor workspace dirancang untuk cepat membaca submission, memberi feedback, dan menjaga alur tetap bergerak.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-card"><div className="metric-label">Assigned</div><div className="metric-value">4</div></div>
          <div className="metric-card"><div className="metric-label">Pending review</div><div className="metric-value">2</div></div>
        </div>
      </section>
      <div className="grid grid-3">
        <PageCard eyebrow="Queue" title="Assigned participants" description="Active assignments and current phase distribution." />
        <PageCard eyebrow="Review" title="Review queue" description="Items waiting for mentor action." />
        <PageCard eyebrow="Cadence" title="Feedback cadence" description="Turnaround and completion metrics." />
      </div>
    </AppShell>
  );
}
