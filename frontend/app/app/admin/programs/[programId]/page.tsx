import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function AdminProgramDetailPage() {
  return (
    <AppShell title="Program Detail" subtitle="View program settings, cohorts, and reporting summary.">
      <PageCard title="Program detail" description="Render program metadata, date windows, and linked cohorts." />
    </AppShell>
  );
}
