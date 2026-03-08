import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function AdminCohortPage() {
  return (
    <AppShell title="Cohort Detail" subtitle="Manage cohort schedules, enrollments, and mentor assignments.">
      <PageCard title="Cohort management" description="Show phase windows, participant counts, and assignment health." />
    </AppShell>
  );
}
