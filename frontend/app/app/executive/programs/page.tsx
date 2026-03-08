import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function ExecutiveProgramsPage() {
  return (
    <AppShell title="Program Summaries" subtitle="Program-level reporting and approved outcome views.">
      <PageCard title="Programs" description="List program summaries with score and implementation indicators." />
    </AppShell>
  );
}
