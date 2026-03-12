import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';
import { getSessionRole } from '@/lib/session';

export default async function AdminCohortParticipantsPage() {
  const role = await getSessionRole();

  return (
    <AppShell title="Participant Enrollment" subtitle="Enroll and monitor cohort participants." roleLabel={role}>
      <section className="hero-banner card">
        <div className="hero-copy">
          <div className="section-eyebrow">Enrollment control</div>
          <h2 className="hero-title">Jaga daftar peserta tetap bersih, jelas, dan mudah diaudit.</h2>
          <p className="muted">Enrollment view harus memudahkan admin membaca status, bukan sekadar menampilkan tabel panjang.</p>
        </div>
        <div className="hero-panel-surface stack">
          <div className="metric-card accent-card"><div className="metric-label">Active enrollments</div><div className="metric-value">24</div></div>
          <div className="metric-strip">
            <div className="metric-card"><div className="metric-label">Pending invites</div><div className="metric-value">3</div></div>
            <div className="metric-card"><div className="metric-label">Seat usage</div><div className="metric-value">80%</div></div>
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Enrollments" description="Render participant list, search, and enrollment actions." />
        <PageCard title="UX direction" description="Prioritize search, status chips, and simple bulk actions so enrollment work stays fast under pressure." />
      </div>
    </AppShell>
  );
}
