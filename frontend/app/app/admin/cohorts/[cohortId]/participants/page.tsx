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
        <PageCard title="Enrollments" description="Render participant list, search, and enrollment actions.">
          <div className="toolbar-row">
            <div className="chip-row">
              <div className="filter-chip is-active">All participants</div>
              <div className="filter-chip">Invited</div>
              <div className="filter-chip">Active</div>
              <div className="filter-chip">Needs mentor</div>
            </div>
            <button className="button" type="button">Invite participant</button>
          </div>
          <div className="table-card">
            <div className="table-head">
              <span>Participant</span>
              <span>Status</span>
              <span>Mentor</span>
              <span>Project</span>
            </div>
            <div className="table-list">
              <div className="table-grid">
                <div className="table-primary"><strong>Rina Hartono</strong><span className="table-secondary">rinah@agency.go.id</span></div>
                <div className="table-cell"><span className="inline-status"><span className="status-dot" />Active</span></div>
                <div className="table-cell">Budi S.</div>
                <div className="table-cell">Permit reform</div>
              </div>
              <div className="table-grid">
                <div className="table-primary"><strong>Andi Prasetyo</strong><span className="table-secondary">andip@agency.go.id</span></div>
                <div className="table-cell">Invited</div>
                <div className="table-cell">Unassigned</div>
                <div className="table-cell">Not started</div>
              </div>
            </div>
          </div>
        </PageCard>
        <PageCard title="UX direction" description="Prioritize search, status chips, and simple bulk actions so enrollment work stays fast under pressure.">
          <div className="summary-panel">
            <strong>Enrollment checklist</strong>
            <div className="journey-list">
              <div className="journey-step"><strong>1</strong><div><h3>Find participant quickly</h3><p className="muted">Search and role filters should be above the list.</p></div></div>
              <div className="journey-step"><strong>2</strong><div><h3>Expose assignment gaps</h3><p className="muted">Show who still needs a mentor or project start.</p></div></div>
              <div className="journey-step"><strong>3</strong><div><h3>Keep actions close</h3><p className="muted">Invite, reassign, and export belong near the table header.</p></div></div>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
