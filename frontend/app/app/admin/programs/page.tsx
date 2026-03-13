import { Briefcase } from 'lucide-react';

import { AppShell } from '@/components/app-shell';
import { AccentCard } from '@/components/accent-card';
import { DataTableCard } from '@/components/data-table-card';
import { FilterToolbar } from '@/components/filter-toolbar';
import { PageCard } from '@/components/page-card';
import { StatCard } from '@/components/stat-card';
import { getSessionRole } from '@/lib/session';

export default async function AdminProgramsPage() {
  const role = await getSessionRole();

  return (
    <AppShell
      title="Programs"
      subtitle="Create and manage TEMPA learning programs."
      roleLabel={role}
      icon={<Briefcase size={22} />}
      stats={
        <>
          <div className="compact-stat">
            <div className="compact-stat-value">1</div>
            <div className="compact-stat-label">Programs</div>
          </div>
          <div className="compact-stat">
            <div className="compact-stat-value">1</div>
            <div className="compact-stat-label">Cohorts</div>
          </div>
        </>
      }
    >
      <div className="metric-strip">
        <AccentCard label="Programs" value={1} />
        <StatCard label="Active cohorts" value={1} />
        <StatCard label="Mentor assignments" value="Live" />
      </div>

      <div className="grid grid-2">
        <PageCard eyebrow="Admin" title="Program management" description="Program list, filters, and create-program entry point.">
          <FilterToolbar
            filters={[
              { label: 'All programs', active: true },
              { label: 'Active' },
              { label: 'Needs setup' },
            ]}
            aside={<button className="button" type="button">New program</button>}
          />
          <DataTableCard
            columns={[
              { label: 'Program' },
              { label: 'Cohorts' },
              { label: 'Status' },
              { label: 'Owner' },
            ]}
            rows={[
              {
                key: 'leadership-essentials',
                primary: <><strong>Leadership Essentials 2026</strong><span className="table-secondary">Primary public-sector learning track</span></>,
                cells: [
                  '1 live',
                  <span className="inline-status"><span className="status-dot" />Active</span>,
                  'Program office',
                ],
              },
              {
                key: 'digital-ops',
                primary: <><strong>Digital Ops Accelerator</strong><span className="table-secondary">Pending launch and rubric sign-off</span></>,
                cells: ['0 draft', 'Needs setup', 'Transformation team'],
              },
            ]}
          />
        </PageCard>
        <PageCard eyebrow="Design principle" title="Simple operations" description="Keep setup tasks grouped so admins can move quickly between program, cohort, and assignment.">
          <div className="summary-panel">
            <strong>Recommended structure</strong>
            <div className="kv-list">
              <div className="kv-row"><span className="kv-key">Primary action</span><strong>Create program</strong></div>
              <div className="kv-row"><span className="kv-key">Secondary action</span><strong>Open cohort setup</strong></div>
              <div className="kv-row"><span className="kv-key">Status read</span><strong>Setup, live, archived</strong></div>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}
