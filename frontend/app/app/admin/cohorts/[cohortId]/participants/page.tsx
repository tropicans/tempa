import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { DataTableCard } from '@/components/data-table-card';
import { FilterToolbar } from '@/components/filter-toolbar';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
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
          <AccentCard label="Active enrollments" value={24} />
          <div className="metric-strip">
            <StatCard label="Pending invites" value={3} />
            <StatCard label="Seat usage" value="80%" />
          </div>
        </div>
      </section>
      <div className="grid grid-2">
        <PageCard title="Enrollments" description="Render participant list, search, and enrollment actions.">
          <FilterToolbar
            filters={[
              { label: 'All participants', active: true },
              { label: 'Invited' },
              { label: 'Active' },
              { label: 'Needs mentor' },
            ]}
            aside={<button className="button" type="button">Invite participant</button>}
          />
          <DataTableCard
            columns={[
              { label: 'Participant' },
              { label: 'Status' },
              { label: 'Mentor' },
              { label: 'Project' },
            ]}
            rows={[
              {
                key: 'rina-hartono',
                primary: <><strong>Rina Hartono</strong><span className="table-secondary">rinah@agency.go.id</span></>,
                cells: [
                  <span className="inline-status"><span className="status-dot" />Active</span>,
                  'Budi S.',
                  'Permit reform',
                ],
              },
              {
                key: 'andi-prasetyo',
                primary: <><strong>Andi Prasetyo</strong><span className="table-secondary">andip@agency.go.id</span></>,
                cells: ['Invited', 'Unassigned', 'Not started'],
              },
            ]}
          />
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
